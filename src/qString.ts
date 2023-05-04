// @ts-check
type OperationLink = (... Arguments: any[]) => LuaTuple<any[]>;

declare global {
    interface String {
        ToHexadecimal(this: string): string;
        FromHexadecimal(this: string): string;

        ToBinary(this: string): string;
        FromBinary(this: string): string;

        Chain(this: string, Operation: OperationLink, Inital: any[], ... Arguments: any[]): LuaTuple<any[]>;
        
        Compress(this: string): string;
        Decompress(this: string): string;

        LeadingUppercase(this: string): string;
        LeadingLowercase(this: string): string;

        RemoveWhitespace(this: string, Spaces?: boolean): string;

        Pascal(this: string): string;
        Camel(this: string): string;
    }
};

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

/** 
 * @this {string}
 * @returns {string}
 */
(string as unknown as String).ToHexadecimal = function(): string {
    return string.gsub(this, ".", (Chunck: string) => string.format("%02x", string.byte(Chunck)[0]))[0];
};

/** 
 * @this {string}
 * @returns {string}
 */
(string as unknown as String).FromHexadecimal = function(): string {
    return string.gsub(this, "..", (Chunck: string) => string.char(tonumber(Chunck, 16) as number))[0];
};

/** 
 * @this {string}
 * @returns {string}
 */
(string as unknown as String).ToBinary = function(): string {
    return string.gsub(this, ".", (Chunck: string) => DecimalToBits(string.byte(Chunck)[0], 8))[0];
};

/** 
 * @this {string}
 * @returns {string}
 */
(string as unknown as String).FromBinary = function(): string {
    return string.gsub(this, string.rep(".", 8), (Chunck: string) => string.char(tonumber(Chunck, 2) as number))[0];
};

/** 
 * @description Chains a list of operations to be applied to this string.
 * 
 * @this {string}
 * @returns {string}
 */
(string as unknown as String).Chain = function(Operation: OperationLink, Inital: unknown[], ...Arguments: any[]): LuaTuple<unknown[]> {
    let Output: LuaTuple<unknown[]> = Operation(this, ... Inital);
    
    Arguments.map((Value: unknown[]) => {
        Output = Operation(Output[0], ... Value);
        return Value;
    });

    return Output;
};

/** 
 * @description Applies basic compression to the string, Intended to be decompressed with the `.Decompress()` method.
 * 
 * @this {string}
 * @returns {string}
 */
(string as unknown as String).Compress = function(): string {
    return this.Chain(string.gsub,
        [".", "\0%0%0"],
        ["(.)%z%1", "%1"],
        ["%z.(%Z+)",
            (Chunck: string) => (Chunck.size() > 4) ? string.format("\129%s%s\254", string.sub(Chunck, 1, 1), Chunck.size()) : Chunck
        ]
    )[0]
};

/** 
 * @description Decompresses the string, Intended to be used on strings which have had their `.Compress()` method called.
 * 
 * @this {string}
 * @returns {string}
 */
(string as unknown as String).Decompress = function(): string {
    return string.gsub(this, "\129.%d+\254", (Chunck: string) => {
        const Section: string = string.sub(Chunck, 2, -2);

        return string.rep(string.sub(Section, 1, 1), tonumber(string.sub(Section, 2, -1)) as number);
    })[0]
};

/** 
 * @description Sets the first character of the string to uppercase.
 * 
 * @this {string}
 * @returns {string}
 */
(string as unknown as String).LeadingUppercase = function(): string {
    return string.gsub(this, "^%l", string.upper)[0];
};

/** 
 * @description Sets the first character of the string to lowercase.
 * 
 * @this {string}
 * @returns {string}
 */
(string as unknown as String).LeadingLowercase = function(): string {
    return string.gsub(this, "^%l", string.lower)[0];
};

/**
 * @description Removes all whitespace characters within the string.
 * 
 * @this {string}
 * @param {boolean} Spaces - Should spaces still be included in the result?
 * @returns {string}
 */
(string as unknown as String).RemoveWhitespace = function(Spaces = false): string {
    let Result = "";

    for (const [ Codepoint ] of utf8.codes(this))
        if (Whitespaces.includes(Codepoint) && (Spaces ? (Codepoint !== 32) : true)) Result += utf8.char(Codepoint);

    return Result;
};

/** 
 * @description Converts the string into "Pascal" case.
 * 
 * @this {string}
 * @returns {string}
 */
(string as unknown as String).Pascal = function(): string {
    return string.gsub(string.lower(this), "%w+", (Chunk: string) => Chunk.LeadingUppercase())[0];
};

/** 
 * @description Converts the string into "Camel" case.
 * 
 * @this {string}
 * @returns {string}
 */
(string as unknown as String).Camel = function(): string {
    return this.Pascal().LeadingLowercase();
};