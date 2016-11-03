import {parseString as xmlParser} from "xml2js";
import {AMCPUtil as AMCPUtilNS} from "./AMCP";
// AMCPUtilNS
import CasparCGSocketResponse = AMCPUtilNS.CasparCGSocketResponse;

export namespace Response {

	/**
	 * 
	 */
	export interface IResponseValidator {
		resolve(response: CasparCGSocketResponse): Object;
	}

	/**
	 * 
	 */
	export class StatusValidator implements IResponseValidator {

		/**
		 * 
		 */
		public resolve(): Object {
			return {};
		}
	}

	/**
	 * 
	 */
	export class XMLValidator implements IResponseValidator {

		/**
		 * 
		 */
		public resolve(response: CasparCGSocketResponse): Object {
			let parseNumbers = function(str: any) {
				if (!isNaN(str)) {
					str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
				}
				return str;
			};

			let returnFalse: Error | undefined;
			let returnData: Object | undefined;

			xmlParser(
				response.items[0].replace("\n", ""),
				{async: false, trim: true, explicitArray: false, valueProcessors: [parseNumbers]},
				(error, result) => {
					returnFalse = error;
					returnData = result;
				});

			return returnFalse ? {} : returnData || {};
		}
	}

	/**
	 * 
	 */
	export class ListValidator implements IResponseValidator {

		/**
		 * 
		 */
		public resolve(response: CasparCGSocketResponse): Object {
			// filters on stringitems in items-list and validates if any items present
			let stringItems: Array<string> = response.items.filter((i) => typeof i === "string");
			return stringItems;
		}
	}

	/**
	 * 
	 */
	export class DataValidator implements IResponseValidator {

		/**
		 * 
		 */
		public resolve(): Object {
			return {};
		}
	}

	/**
	 * 
	 */
	export class Base64Validator implements IResponseValidator {

		/**
		 * 
		 */
		public resolve(response: CasparCGSocketResponse): Object {
			return response.items[0];
		}
	}

	/**
	 * 
	 */
	export class SomeThingValidator implements IResponseValidator {

		/**
		 * 
		 */
		public resolve(): Object {
			return {};
		}
	}
}