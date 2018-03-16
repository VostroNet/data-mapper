import DataMapper from "../index";

export default function map(input, component, mapper) {
  const innerMapper = new DataMapper({
    connections: component.connections,
    components: component.components,
  });
  return Promise.all(input.map((i) => {
    return innerMapper.run(i);
  }));
}
map.single = true;
