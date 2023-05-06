// Extended Datatypes
import { qNumber } from "./Datatypes/qNumber";
import { qString } from "./Datatypes/qString";

// Extended Instances
import { qHumanoid } from "./Instances/qHumanoid";

type Extended =
    // Datatypes
    ((arg0: number) => (qNumber & number)) & // String[s]
    ((arg0: string) => (qString & string)) & // Number[s]
    
    // Instances
    ((arg0: Humanoid) => (qHumanoid & Humanoid));


/**
 * @description Provides an "extended" version of whatever instance or datatype you pass-through it.
 * 
 * @param {Type} Input The original datatype which you intend to query or extend.
 * @returns {Type} The extended version of the input.
 */
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

export default Default;