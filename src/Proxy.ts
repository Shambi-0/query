import { qRawGet, qRawSet } from "./Indexer";

/**
 * @description Flattens the provided function slightly.
 */
const F = (Callback: unknown) => (_: unknown, ... Arguments: unknown[]) => (Callback as any)(... Arguments);

export default class qProxy {
    public Reference: any;
    public Proxy = {};

    /**
     * @description Creates a proxied version of a given class & it's represented value.
     * 
     * @param {any} Reference Real class this class will be creating a proxy of.
     * @param {any} Basic Basic instance/datatype the "Reference" represents.
     * @returns {qProxy} The proxied iteration of the provided "Reference".
     */
    constructor(Reference: defined, Basic: defined, Varient: "Object" | "Datatype") {
        let Metatable: defined = {
            __index: (_: defined, Key: defined) => {
                let Value, Instead = rawget(Reference, Key); pcall(() => Value = qRawGet(getmetatable(Basic), Key));

                if (typeOf(Instead) === "function") {
                    const Shallow: unknown = Instead;
                    Instead = (Iteration: defined, ... Arguments: any[]) => (Shallow as any)(... ((Iteration === Metatable) ? [ Iteration, Basic, ... Arguments ] : [Metatable, Basic, Iteration, ... Arguments]));
                };

                return Value ? Value : Instead;
            },
            __newindex: (Original: unknown, Key: unknown, Value: unknown) => {
                const A = (Original as any)[Key as any], B = rawget(Reference, Key);

                if ((Value !== undefined) || (((A as unknown) !== undefined) && ((A as unknown) !== B))) throw `Operation failed during \"__newindex\" call.`;

                pcall(() => qRawSet(Basic, Key, Value));
            }
        };

        this.Reference = Reference;
        setmetatable(this.Proxy, Metatable)
    };

    /**
     * @description Extends the proxies' internal metatable.
     * 
     * @param {Readonly<any[any]>} Extention The extended metatable that will be applied.
     * @returns {qProxy} The newly generated metatable, representing the modified proxy.
     */
    public Extend(Extention: Readonly<any[any]>) {
        setmetatable(this.Proxy, { ... getmetatable(this.Proxy) as any, ... Extention });
        return this;
    };

    /**
     * @description Applies most "Arthmetic" attributes to this proxies' metatable.
     * 
     * @param {any} Of The "basic" datatype these attributes will use in-place of the proxy.
     * @returns {qProxy} The newly generated metatable, representing the modified proxy.
     */
    public Arthmetic(Of: unknown) {
        this.Extend({
            // Negate
            __unm: () => -(Of as number),

            __add: F((Value: unknown) => (Of as number) + (Value as number)),
            __sub: F((Value: unknown) => (Of as number) - (Value as number)),
            __mul: F((Value: unknown) => (Of as number) * (Value as number)),
            __div: F((Value: unknown) => (Of as number) / (Value as number)),
            __mod: F((Value: unknown) => (Of as number) % (Value as number)),
            __pow: F((Value: unknown) => math.pow((Of as number), (Value as number)))
        });
        return this;
    };

    /**
     * @description Applies most "Logistic" attributes to this proxies' metatable.
     * 
     * @param {any} Of The "basic" datatype these attributes will use in-place of the proxy.
     * @returns {qProxy} The newly generated metatable, representing the modified proxy.
     */
    public Logistic(Of: unknown) {
        this.Extend({
            __eq: F((Value: unknown) => (Of as unknown) === (Value as unknown)),
            __lt: F((Value: unknown) => (Of as number)  <   (Value as number)),
            __le: F((Value: unknown) => (Of as number)  <=  (Value as number))
        });
        return this;
    };
};