import qProxy from "../Proxy";
import { qString } from "./qString";

const C = (Basic: number) => { return new qNumber(Basic) as qNumber & number };

export class qNumber {
    constructor(Basic: number) {
        const Proxied = new qProxy(this, Basic, "Datatype")
        
        return Proxied.Arthmetic(Basic).Logistic(Basic).Extend({
            __metatable: Basic,
            __tostring: () => Basic
        }).Proxy as qNumber & number;
    };

    /**
     * @description In mathematics, the Cantor function is an example of a function that is continuous, but not absolutely continuous. It is a notorious counterexample in analysis, because it challenges naive intuitions about continuity, derivative, and measure. Though it is continuous everywhere and has zero derivative almost everywhere, its value still goes from 0 to 1 as its argument reaches from 0 to 1. Thus, in one sense the function seems very much like a constant one which cannot grow, and in another, it does indeed monotonically grow.
     *  
     * @param {number} Y Second axis to traverse. 
     * @returns {qNumber}
     * {@link https://en.wikipedia.org/wiki/Cantor_function}
     * {@link https://www.npmjs.com/package/@rbxts/query}
     */
    public Cantor2(Y: number): qNumber & number {
        const Z: number = (this as unknown as number) + Y;

        return C(((Z + 1) * Z) / 2 + (this as unknown as number));
    }

    /**
     * @description Inverse for numbers which have been passed through a Cantor2 function.
     * 
     * @returns {LuaTuple<number[]>}
     * {@link https://en.wikipedia.org/wiki/Cantor_function}
     * {@link https://www.npmjs.com/package/@rbxts/query}
     */
    public InverseCantor2(): LuaTuple<(qNumber & number)[]> {
        const Normalized = tonumber(tostring(this)) as number;

        const W: number = math.floor((math.sqrt(8 * Normalized + 1) - 1) / 2);
        const X: number = Normalized - ((math.pow(W, 2) + W) / 2);

        return $tuple(C(X), C(W - X));
    };

    /**
     * @description Converts the given number into raw binary in the form of a string.
     * 
     * @param {number} [Padding] Minimum number of bits which this decimal should be contained within.
     * @returns {string}
     * {@link https://www.npmjs.com/package/@rbxts/query}
     */
    public DecimalToBits(Padding?: number): qString & string {
        const Bits: number[] = [];
        let Integer = tonumber(tostring(this)) as number;

        if (!Padding) Padding = math.max(1, math.frexp(Integer)[2]);
    
        for (let Bit = Padding; Bit > 1; Bit--) {
            Bits[Bit] = math.fmod(Integer, 2)
            Integer = math.floor((Integer - Bits[Bit]) / 2);
        };
    
        return new qString(Bits.join()) as qString & string;
    };
};