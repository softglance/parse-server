var LoggerController = require('../src/Controllers/LoggerController').LoggerController;
var WinstonLoggerAdapter = require('../src/Adapters/Logger/WinstonLoggerAdapter').WinstonLoggerAdapter;

describe('LoggerController', () => {
  it('can check process a query without throwing', (done) => {
    // Make mock request
    var query = {};

    var loggerController = new LoggerController(new WinstonLoggerAdapter());

    expect(() => {
      loggerController.getLogs(query).then(function(res) {
        expect(res.length).not.toBe(0);
        done();
      }).catch((err) => {
        jfail(err);
        done();
      })
    }).not.toThrow();
  });

  it('properly validates dateTimes', (done) => {
    expect(LoggerController.validDateTime()).toBe(null);
    expect(LoggerController.validDateTime("String")).toBe(null);
    expect(LoggerController.validDateTime(123456).getTime()).toBe(123456);
    expect(LoggerController.validDateTime("2016-01-01Z00:00:00").getTime()).toBe(1451606400000);
    done();
  });

  it('can set the proper default values', (done) => {
    // Make mock request
    var result = LoggerController.parseOptions();
    expect(result.size).toEqual(10);
    expect(result.order).toEqual('desc');
    expect(result.level).toEqual('info');

    done();
  });

  it('can process a query without throwing', (done) => {
    // Make mock request
    var query = {
      from: "2016-01-01Z00:00:00",
      until: "2016-01-01Z00:00:00",
      size: 5,
      order: 'asc',
      level: 'error'
    };

    var result = LoggerController.parseOptions(query);

    expect(result.from.getTime()).toEqual(1451606400000);
    expect(result.until.getTime()).toEqual(1451606400000);
    expect(result.size).toEqual(5);
    expect(result.order).toEqual('asc');
    expect(result.level).toEqual('error');

    done();
  });

  it('can check process a query without throwing', (done) => {
    // Make mock request
    var query = {
      from: "2016-01-01",
      until: "2016-01-30",
      size: 5,
      order: 'desc',
      level: 'error'
    };

    var loggerController = new LoggerController(new WinstonLoggerAdapter());

    expect(() => {
      loggerController.getLogs(query).then(function(res) {
        expect(res.length).toBe(0);
        done();
      }).catch((err) => {
        jfail(err);
        fail("should not fail");
        done();
      })
    }).not.toThrow();
  });

  it('should throw without an adapter', (done) => {
    expect(() => {
      new LoggerController();
    }).toThrow();
    done();
  });

  it('should replace implementations with verbose', (done) => {
    const adapter = new WinstonLoggerAdapter();
    const logger = new LoggerController(adapter, null, {verbose: true });
    spyOn(adapter, "log");
    logger.silly('yo!');
    expect(adapter.log).not.toHaveBeenCalled();
    done();
  });

  it('should replace implementations with logLevel', (done) => {
    const adapter = new WinstonLoggerAdapter();
    const logger = new LoggerController(adapter, null, { logLevel: 'error' });
    spyOn(adapter, "log");
    logger.warn('yo!');
    logger.info('yo!');
    logger.debug('yo!');
    logger.verbose('yo!');
    logger.silly('yo!');
    expect(adapter.log).not.toHaveBeenCalled();
    logger.error('error');
    expect(adapter.log).toHaveBeenCalled();
    done();
  });
});
