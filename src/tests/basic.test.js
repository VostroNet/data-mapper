
import debug from "debug";
import "dotenv/config";
import sourceMapSupport from "source-map-support";

import rules from "./data/rules";
import sourceData from "./data/source-data";

sourceMapSupport.install();
debug.enable("datamapper:*");

import DataMapper from "../index";

test("basic test", async() => {
  const mapper = new DataMapper(rules);
  const output = await mapper.run(sourceData);
  expect(output).toMatchObject({
    id: 123,
    name: "firstName lastName",
    deviceIds: [432, 433],
  });
});

