import qProxy from "../Proxy";

/**
 * @description Flattens the provided function slightly.
 */
const F = (Callback: unknown) => (_: unknown, ... Arguments: unknown[]) => (Callback as any)(... Arguments);

export class qHumanoid {
    constructor(Basic: Humanoid) {
        const Proxied = new qProxy(this, Basic, "Object")
        
        return Proxied.Logistic(Basic).Extend({

            __metatable: Basic,
            __tostring: () => Basic,

            __eq: F((Value: unknown) => Basic === (Value as unknown))

        }).Proxy as qHumanoid & Humanoid;
    };

    /**
     * @description Heals the given humanoid.
     * 
     * @param {number} [Amount] Amount health you'd like to heal the humanoid by. (Undefined will heal the humanoid to it's max health.)
     * @this {qHumanoid & Humanoid} The Humanoid that will be healed.
     * @returns {qHumanoid & Humanoid} The Humanoid that has been healed.
     * {@link https://www.npmjs.com/package/@rbxts/query}
     */
    public Heal(... Arguments: [ number? ]): qHumanoid & Humanoid {
        const [, Basic, Amount] = [ ... Arguments, {} as Humanoid, 0 ];

        Basic.Health += Amount ? Amount : (Basic.MaxHealth - Basic.Health);
        return this as unknown as qHumanoid & Humanoid;
    };

    /**
     * @description Kills the given humanoid. (Same as: "Humanoid.Health = 0")
     * 
     * @this {qHumanoid & Humanoid} The Humanoid that will be killed.
     * @returns {qHumanoid & Humanoid} The Humanoid that has been killed.
     * {@link https://www.npmjs.com/package/@rbxts/query}
     */
    public Kill(... Arguments: []): qHumanoid & Humanoid {
        const [, Basic] = [ ... Arguments, undefined, {} as Humanoid ];

        Basic.Health = 0;

        return this as unknown as qHumanoid & Humanoid;
    };
};