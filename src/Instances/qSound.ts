import qProxy from "../Proxy";

/**
 * @description Flattens the provided function slightly.
 */
const F = (Callback: unknown) => (_: unknown, ... Arguments: unknown[]) => (Callback as any)(... Arguments);

export class qSound {
    constructor(Basic: Sound) {
        const Proxied = new qProxy(this, Basic, "Object")
        
        return Proxied.Logistic(Basic).Extend({

            __metatable: Basic,
            __tostring: () => Basic,

            __eq: F((Value: unknown) => Basic === (Value as unknown))

        }).Proxy as qSound & Sound;
    };

    /**
     * @yields
     * @description Waits for the sound to be loaded if it isn't already.
     * 
     * @this {qSound & Sound} The Sound object that you will wait on.
     * @returns {qSound & Sound} The Sound that has been properly loaded.
     * {@link https://www.npmjs.com/package/@rbxts/query}
     */
    public Await(... Arguments: []): qSound & Sound {
        const [, Basic] = [ ... Arguments, undefined, {} as Sound ];
        
        if (!Basic.IsLoaded) Basic.Loaded.Wait();

        return this as unknown as qSound & Sound;
    };
};