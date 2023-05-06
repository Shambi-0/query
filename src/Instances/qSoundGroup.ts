import qProxy from "../Proxy";
import Soundtrack from "@rbxts/soundtrack";

/**
 * @description Flattens the provided function slightly.
 */
const F = (Callback: unknown) => (_: unknown, ... Arguments: unknown[]) => (Callback as any)(... Arguments);

export class qSoundGroup {
    private $Soundtrack: qSoundGroup | undefined;

    constructor(Basic: SoundGroup) {
        const Proxied = new qProxy(this, Basic, "Object")
        
        this.$Soundtrack = new Soundtrack()

        return Proxied.Logistic(Basic).Extend({

            __metatable: Basic,
            __tostring: () => Basic,

            __eq: F((Value: unknown) => Basic === (Value as unknown))

        }).Proxy as qSoundGroup & SoundGroup;
    };
};