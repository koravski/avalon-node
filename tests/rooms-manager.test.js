const RoomsManager = require('../src/rooms-manager');
const Room         = require('../src/room');

test('should add and then get a room', () => {
  const manager = new RoomsManager();

  manager.add('id-1');
  const room = manager.get('id-1');

  expect(room instanceof Room).toStrictEqual(true);
});

test('should create a room if the room with such an id doesn\'t already exist', () => {
  const manager = new RoomsManager();

  const room = manager.getOrCreate('id-1');

  expect(room instanceof Room).toStrictEqual(true);
});

test('should return the room with the specified id', () => {
  const manager = new RoomsManager();

  manager.add('id-1');

  expect(manager.get('id-1')).toBeDefined();
  expect(manager.get('nonexistent-id')).toBeUndefined();
});

test('should return or create a room with the specified id if such doesn\'t exist', () => {
  const manager = new RoomsManager();

  manager.add('id-1');

  expect(manager.get('id-1')).toEqual(manager.getOrCreate('id-1'));
  expect(manager.getOrCreate('nonexistent-id')).toBeDefined();
});

test('should destroy a room', () => {
  const manager = new RoomsManager();

  const room = manager.getOrCreate('id-1');

  jest.spyOn(room, 'destroy');

  manager.destroyRoom('id-1');

  expect(manager.get('id-1')).toBeUndefined();
  expect(room.destroy).toBeCalled();
});

test('should check inactivity statuses for every room', () => {
  const manager = new RoomsManager();
  jest.spyOn(manager, 'get');

  manager.add('id-1');
  manager.add('id-2');

  manager.purgeInactiveRooms();

  expect(manager.get).toBeCalledTimes(2);
});

test('should purge only inactive rooms', () => {
  Room.emitToAll = jest.fn();

  const manager = new RoomsManager();

  const pastDate = Date.now() - 1500;
  jest.spyOn(Date, 'now')
    .mockImplementationOnce(() => pastDate);

  // the room is created in the
  // past (because of the above mock)
  manager.add('id-1');

  // the room is created in the present
  manager.add('id-2');

  manager.purgeInactiveRooms(1000);

  expect(manager.get('id-1')).toBeUndefined();
  expect(manager.get('id-2')).toBeDefined();
});
