export abstract class Gateways {
  /**
   * Driver gateway
   * @static
   * @memberof Gateways
   * @example update-location
   * @example driver
   */
  static Driver = class {
    /** driver */
    static Namespace = 'driver';
    /** update-location */
    static UpdateLocation = 'update-location';
    /** driver-offer */
    static DriverOffer = 'driver-offer';
  };

  /**
   * Order gateway
   * @static
   * @memberof Gateways
   * @example order
   * @example order-offer
   */
  static Order = class {
    /** order */
    static Namespace = 'order';
    /** order-offer */
    static OrderOffer = 'order-offer';
    /** order-tracking */
    static OrderTracking = 'order-tracking';
  };

  /**
   * Order gateway
   * @static
   * @memberof Gateways
   * @example offer
   */
  static Offer = class {
    /** order */
    static Namespace = 'offer';
    /** order-offer */
    static offerCreated = 'multi_RFP_id-';
  };

  static Discussion = class {
    /** discussion */
    static Namespace = 'discussion';
  }
}
