import Map "mo:map/Map";

module {
  type Map<K, V> = Map.Map<K, V>;
  public type HashUtils<K> = Map.HashUtils<K>;

  public type TwoWayMap<A, B> = {
    forward : Map<A, B>;
    reverse : Map<B, A>;
  };

  public func new<A, B>() : TwoWayMap<A, B> {
    return {
      forward = Map.new();
      reverse = Map.new();
    };
  };

  public func get<A, B>(data : TwoWayMap<A, B>, hashUtils : HashUtils<A>, keyParam : A) : ?B {
    return Map.get(data.forward, hashUtils, keyParam);
  };

  public func getReverse<A, B>(data : TwoWayMap<A, B>, hashUtils : HashUtils<B>, keyParam : B) : ?A {
    return Map.get(data.reverse, hashUtils, keyParam);
  };

  public func has<A, B>(data : TwoWayMap<A, B>, hashUtils : HashUtils<A>, keyParam : A) : Bool {
    return Map.has(data.forward, hashUtils, keyParam);
  };

  public func hasReverse<A, B>(data : TwoWayMap<A, B>, hashUtils : HashUtils<B>, keyParam : B) : Bool {
    return Map.has(data.reverse, hashUtils, keyParam);
  };

  public func set<A, B>(data : TwoWayMap<A, B>, hashUtilsA : HashUtils<A>, hashUtilsB : HashUtils<B>, keyParamA : A, keyParamB : B) {
    Map.set(data.forward, hashUtilsA, keyParamA, keyParamB);
    Map.set(data.reverse, hashUtilsB, keyParamB, keyParamA);
  };

};
