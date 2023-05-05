/*
import "./qString";

const Testing = "Hello, World!";

Testing.Compress().Decompress(); // Example of string (de)compression! :D

Testing.RemoveWhitespace() // Removes whitespace!

Testing.Camel().Pascal() // Changes the casing of the string 👀

Testing.ToHexadecimal() // Example of encoding formats! 👀
*/

import { qNumber } from "./Datatypes/qNumber";
import { qString } from "./Datatypes/qString";

type Extended =
    ((arg0: number) => (qNumber & number)) & // String[s]
    ((arg0: string) => (qString & number)); // Number[s]

const Default: Extended = ((Input: defined) => {
    let Output;

    switch(typeOf(Input)) {
        case "number":
            Output = new qNumber(Input as number);
            break;

        case "string":
            Output = new qString(Input as string);
            break;

        default:
            Output = Input;
            break;
    };

    return Output as defined;
}) as unknown as Extended;

/**
 * Provides an "extended" version of whatever instance or datatype you pass-through it.
 * 
 * @param {Type} Input The original datatype which you intend to query or extend.
 * @returns {Type}
 */
export default Default;

const Example = Default("Hello, World!")

Example.To("Hexadecimal");