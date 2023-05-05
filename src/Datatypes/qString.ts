import qProxy from "../Proxy";

const Whitespaces: number[] = [
	9, // Horizontal Tab
	10, // Line Feed
	11, // Vertical Tab
	12, // Form Feed
	13, // Carriage return
	32, // Space
	133, // Next Line
	160, // No-Break Space
	5760, // Ogham Space Mark
	8192, // En Quad
	8193, // Em Quad
	8194, // En Space
	8195, // Em Space
	8196, // Three-Per-Em Space
	8197, // Four-Per-Em Space
	8198, // Six-Per-Em Space
	8199, // Figure Space
	8200, // Punctuation Space
	8201, // Thin Space
	8202, // Hair Space
	8232, // Line Separator
	8233, // Paragraph Separator
	8239, // Narrow No-Break Space
	8287, // Medium Mathematical Space
	12288, // Ideographic Space

	//<<>> Special Cases <<>>//

	6158, // Mongolian Vowel Separator
	8203, // Zero Width Space
	8204, // Zero Width Non-Joiner
	8205, // Zero Width Joiner
	8288, // Word Joiner
	65279 // Zero Width Non-Breaking Space
];

const DecimalToBits = (Integer: number, Padding = math.max(1, math.frexp(Integer)[2])): string => {
    const Bits: number[] = [];

    for (let Bit = Padding; Bit > 1; Bit--) {
        Bits[Bit] = math.fmod(Integer, 2)
        Integer = math.floor((Integer - Bits[Bit]) / 2);
    };

    return Bits.join();
};

export class qString {
    constructor(Basic: string) {
        const Proxied = new qProxy(this, Basic, "Datatype")
        
        return Proxied.Logistic(Basic).Extend({
            __metatable: Basic,
            __tostring: () => Basic
        }).Proxy as qString & string;
    };

    /**
     * @description A function for quickly converting plaintext into a specific encoding.
     * 
     * @param Format The format you would like to convert this string to.
     * @returns {qString & string}
     * {@link https://www.npmjs.com/package/@rbxts/query}
     */
    public To(... Arguments: [ "Hexadecimal" | "Binary" | "None" ]): qString & string {
        const [, Basic, Format] = [ ... Arguments, "", "" ];

        const Normalized: string = tostring(Basic);
        let Output;

        switch(Format) {
            case "Hexadecimal":
                Output = string.gsub(Normalized, ".", (Character: string): string => string.format("%02x", string.byte(Character)[0]))[0];
                break;
            
            case "Binary":
                Output = string.gsub(Normalized, ".", (Chunck: string) => DecimalToBits(string.byte(Chunck)[0], 8))[0];
                break;

            default:
                Output = Normalized;
                break;
        };

        return new qString(Output as string) as qString & string;
    };

    /**
     * @description A function for quickly retrieving the plaintext from an encoded string.
     * 
     * @param Format The format you are converting this string from.
     * @returns {qString & string}
     * {@link https://www.npmjs.com/package/@rbxts/query}
     */
    public From(... Arguments: [ "Hexadecimal" | "Binary" | "None" ]): qString & string {
        const [, Basic, Format] = [ ... Arguments, "", "" ];

        const Normalized: string = tostring(Basic);
        let Output;

        switch(Format) {
            case "Hexadecimal":
                Output = string.gsub(Normalized, "..", (Chunck: string) => string.char(tonumber(Chunck, 16) as number))[0];
                break;
            
            case "Binary":
                Output = string.gsub(Normalized, string.rep(".", 8), (Chunck: string) => string.char(tonumber(Chunck, 2) as number))[0];
                break;

            default:
                Output = Normalized;
                break;
        };

        return new qString(Output as string) as qString & string;
    };

    /**
     * @description Removes all whitespace characters from the given string, Optionally leaving spaces for text filtering.
     * 
     * @param {boolean} [Spaces] Should normal spaces (Aka: "\32" or " ") be left alone?
     * @returns {string} The resulting string, Which has had specific whitespace characters removed.
     * {@link https://en.wikipedia.org/wiki/Whitespace_character}
     * {@link https://www.npmjs.com/package/@rbxts/query}
     */
    public RemoveWhitespace(... Arguments: [ boolean? ]): qString & string {
        const [, Basic, Spaces = false] = [ ... Arguments, "" ];

        const Normalized: string = tostring(Basic);
        let Output = "";

        for (const [ Codepoint ] of utf8.codes(Normalized))
            if (Whitespaces.includes(Codepoint) && (Spaces ? (Codepoint !== 32) : true)) Output += utf8.char(Codepoint);

        return new qString(Output as string) as qString & string;
    };
};