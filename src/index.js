import dotty from "dotty";
import logger from "./utils/logger";
import modules from "./modules";
const log = logger("index:");

export default class DataMapper {
  constructor(options) {
    const {components = [], connections = []} = options;
    this.components = components;
    this.connections = connections;
    // log.debug("constructor", options);
  }
  async run(input) {
    log.debug("start - input", input);
    let connComplete = 0;
    let trackComplete = {};
    let context = {
      input,
      output: {}, //TODO: set this to actual defined type
    };
    this.components.forEach(component => {
      context[component.name] = {};
    });
    log.debug("start", this.connections.length);
    do {
      let connections = this.connections.filter(c => !trackComplete[c.id]);
      log.debug("connections to complete", connections[0]);
      connComplete = connections.length;
      if (connComplete > 0) {
        connections.map(conn => {
          if (dotty.exists(context, conn.source)) {
            log.debug(`[${conn.id}] copy ${conn.source} -> ${conn.target}`);
            dotty.put(context, conn.target, dotty.get(context, conn.source));
            trackComplete[conn.id] = true;
          }
        });
        await Promise.all(this.components.filter(c => !trackComplete[c.id]).map(async(component) => {
          let input = {};
          let ready = true;
          if (modules[component.type].single) {
            if (!dotty.exists(context, `${component.id}.input`)) {
              ready = false;
            } else {
              input = dotty.get(context, `${component.id}.input`);
            }
          } else {
            Object.keys(component.input).forEach(inputName => {
              let inputKey = `${component.id}.${inputName}`;
              log.debug("input key", inputKey);
              if (!dotty.exists(context, inputKey)) {
                ready = false;
              } else {
                dotty.put(input, inputName, dotty.get(context, inputKey));
              }
            });
          }
          if (ready) {
            log.debug(`component ready - ${component.type}`, input);
            const output = await modules[component.type](input, component, this);
            trackComplete[component.id] = true;
            log.debug(`component done - ${component.type}`, output);
            dotty.put(context, `${component.id}.output`, output);
          }
          return component;
        }));
      }
    } while (connComplete > 0);
    return context.output;
  }
}

