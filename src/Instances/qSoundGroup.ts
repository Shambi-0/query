import qProxy from "../Proxy";
import { Soundtrack } from "@rbxts/soundtrack";
import { qSound } from "./qSound";

/**
 * @description Flattens the provided function slightly.
 */
const F = (Callback: unknown) => (_: unknown, ... Arguments: unknown[]) => (Callback as any)(... Arguments);

export class qSoundGroup {
    /**
     * @yields
     * @returns {qSoundGroup & SoundGroup}
     */
    constructor(Basic: SoundGroup) {
        const Proxied = new qProxy(this, Basic, "Object")

        return Proxied.Logistic(Basic).Extend({

            __metatable: Basic,
            __tostring: () => Basic,

            __eq: F((Value: unknown) => Basic === (Value as unknown)),
            __playlist: new Soundtrack(Basic)

        }).Proxy as qSoundGroup & SoundGroup;
    };

    /**
     * @description Retrieves all of the songs registered inside of this SoundGroup.
     * 
     * @this {qSoundGroup & SoundGroup} The SoundGroup this list will be pulled from.
     * @returns {qSound[]} List of songs in this SoundGroup.
     * {@link https://www.npmjs.com/package/@rbxts/query}
     */
    public GetSongs(): qSound[] {
        return this.__this().Songs.map((Value: Sound) => new qSound(Value));
    };

    /**
     * @description Retrieves the current song that is being played.
     * 
     * @this {qSoundGroup & SoundGroup} The SoundGroup that the song will be retrieved from.
     * @returns {(qSound & Sound) | undefined} The current song that is being played.
     * {@link https://www.npmjs.com/package/@rbxts/query}
     */
    public GetActive(): (qSound & Sound) | undefined {
        const Found: Sound | undefined = this.__this().Songs.find((Value: Sound) => Value.IsPlaying);

        return Found ? (new qSound(Found) as qSound & Sound) : undefined;
    };

    /**
     * @description Checks if there is a song currently playing.
     * 
     * @this {qSoundGroup & SoundGroup} The SoundGroup that will be checked.
     * @returns {boolean} Is a song playing?
     * {@link https://www.npmjs.com/package/@rbxts/query}
     */
    public IsPlaying(): boolean {
        return this.__this().Playing;
    };
    
    public async Play(): Promise<qSoundGroup & SoundGroup> {
        this.__this().Play();
        return this as unknown as qSoundGroup & SoundGroup;
    };

    public async Pause(): Promise<qSoundGroup & SoundGroup> {
        this.__this().Pause();
        return this as unknown as qSoundGroup & SoundGroup;
    };

    public async Stop(): Promise<qSoundGroup & SoundGroup> {
        this.__this().Stop();
        return this as unknown as qSoundGroup & SoundGroup;
    };

    public async Skip(To?: number): Promise<qSoundGroup & SoundGroup> {
        this.__this().Skip(To);
        return this as unknown as qSoundGroup & SoundGroup;
    };

    public async Shuffle(): Promise<qSoundGroup & SoundGroup> {
        this.__this().Play();
        return this as unknown as qSoundGroup & SoundGroup;
    };

    /**
     * @hidden
     * @this {qSoundGroup & SoundGroup} The SoundGroup the internal Soundtrack will be pulled from.
     * @returns {Soundtrack} An internal "Soundtrack" object.
     */
    private __this(): Soundtrack {
        return (getmetatable(this) as { __playlist: Soundtrack }).__playlist
    };
};

const Example = new qSoundGroup({} as SoundGroup);