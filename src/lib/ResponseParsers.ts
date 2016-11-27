import {TypedJSON} from "typedjson-npm";
import * as _ from "highland";

// config NS
import {Config as ConfigNS} from "./Config";
import Config207 = ConfigNS.Config207;
import Config210 = ConfigNS.Config210;

export namespace Response {

	/**
	 * 
	 */
	export interface IResponseParser {
		context?: Object;
		parse(data: Object): Object;
	}

	/**
	 * 
	 */
	export abstract class AbstractParser {
		context?: Object;
	}

	/**
	 * 
	 */
	export class ChannelParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			let result: Array<Object> = [];
			let components: Array<string> = data.toString().split(/\s|,/);

			while (components.length > 0) {
				result.push({channel: components.shift(), format: components.shift(), status: components.shift()});
			}

			if (result.length > 0) {
				return result;
			}

			return {};
		}
	}

	/**
	 * 
	 */
	export class ConfigParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		private childrenToArray(root: Object, childIndices: Array<string>): Object {
			_.pairs(root).map((i) => {
				let outerKey: string = i[0].toString();
				let outerValue: Object = i[1];
				// filter top-level possible arrays
				if (childIndices.indexOf(outerKey) > -1) {
					let flatArray: Array<Object> = [];
					for (let innerKey in outerValue) {
						let innerValue: Object = outerValue[innerKey];
						if (typeof innerValue === "object") {
							if (Array.isArray(innerValue)) { // multiple innervalues
								innerValue.forEach((o: Object) => {
									o["_type"] = innerKey;
									flatArray.push(o);
								});
							} else { // single inner object
								innerValue["_type"] = innerKey;
								flatArray.push(innerValue);
							}
						// update outer member with transformed array of inner members
						}else {
							flatArray.push({type: innerKey});
						}
					}
					i[1] = flatArray;
				}
				return i;
			}).toArray((i) => {
					root = {};
					i.forEach((o) => {
						root![(<string>o[0])] = o[1];
					});
				});
			return root;
		}

		/**
		 * 
		 */
		public parse(data: Object): Object {

			data = this.childrenToArray(data, ["channels", "controllers", "template-hosts"]);
			if (data.hasOwnProperty("channels")) {
				for (let i in data["channels"]) {
					data["channels"][i] = this.childrenToArray(data["channels"][i], ["consumers"]);
				}
			}
			if (data.hasOwnProperty("osc")) {
				data["osc"] = this.childrenToArray(data["osc"], ["predefined-clients"]);
			}
			if (data.hasOwnProperty("audio")) {
				data["audio"] = this.childrenToArray(data["audio"], ["channel-layouts", "mix-configs"]);
				if (data["audio"].hasOwnProperty("channel-layouts")) {
					let o: string;
					for (let i in data["audio"]["channel-layouts"]) {
						if (data["audio"]["channel-layouts"][i]["type"]) {
						o = (data["audio"]["channel-layouts"][i]["type"]).toString();
						o += o.indexOf(".") === -1 ? ".0" : "";
						data["audio"]["channel-layouts"][i]["type"] = o;
						}
					}
				}
				if (data["audio"].hasOwnProperty("mix-configs")) {
					let o: string;
					for (let i in data["audio"]["mix-configs"]) {
						if (data["audio"]["mix-configs"][i]["to"]) {
							o = (data["audio"]["mix-configs"][i]["to"]).toString();
							o += o.indexOf(".") === -1 ? ".0" : "";
							data["audio"]["mix-configs"][i]["to"] = o;
						}
						if (data["audio"]["mix-configs"][i]["from"]) {
							o = (data["audio"]["mix-configs"][i]["from"]).toString();
							o += o.indexOf(".") === -1 ? ".0" : "";
							data["audio"]["mix-configs"][i]["from"] = o;
						}
						if (data["audio"]["mix-configs"][i]["to-types"]) {
							o = (data["audio"]["mix-configs"][i]["to-types"]).toString();
							o += o.indexOf(".") === -1 ? ".0" : "";
							data["audio"]["mix-configs"][i]["to-types"] = o;
						}
						if (data["audio"]["mix-configs"][i]["from-type"]) {
							o = (data["audio"]["mix-configs"][i]["from-type"]).toString();
							o += o.indexOf(".") === -1 ? ".0" : "";
							data["audio"]["mix-configs"][i]["from-type"] = o;
						}

						data["audio"]["mix-configs"][i] = this.childrenToArray(data["audio"]["mix-configs"][i], ["mappings"]);
					}
				}
				if (data["flash"] && data["flash"]["buffer-depth"]) {
					data["flash"]["buffer-depth"] = (data["flash"]["buffer-depth"]).toString();
				}
			}

			console.log(this.context);

			let dataString: string = JSON.stringify(data).toLowerCase();
			// console.log("FØØØRRRRR:::::", dataString);
			let result: Config207 | Config210 | {}  = {};
			try {
				result = TypedJSON.parse(dataString, Config207);
			}catch (e) {
				// @todo: handle
				console.log("CONFIG PARSE ERROR: ", e);
			}
			// console.log("PARSED JSON:::::", JSON.stringify(result));
			// console.log("PARSED TJSON:::::", TypedJSON.stringify(result));
			return result;
		}
	}

	/**
	 * 
	 */
	export class DataParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class DataListParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class InfoTemplateParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class HelpParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class GLParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class InfoDelayParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class InfoParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class InfoThreadsParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class ThumbnailParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return `data:image/png;base64,${data}`;
		}
	}

	/**
	 * 
	 */
	export class VersionParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class PathParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Array<any>): Object {

			return data.map((i) => {
				let components: Array<string> = i.split(" ");

				// is font
				if (components.length === 2) {
					return {name: components[1].replace(/\"/g, ""), type: "font"};
				 }

				// is template
				if (components.length === 4) {
					return {name: components[0].replace(/\"/g, ""), type: "template"};
				}

				// is media
				return {name: components[0].replace(/\"/g, ""), type: components[1].toLowerCase() === "movie" ? "video" : components[1].toLowerCase() === "still" ? "image" : components[1].toLowerCase()};

			});
		}
	}

	/**
	 * 
	 */
	export class CinfParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class InfoQueuesParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class InfoServerParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class InfoPathsParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

	/**
	 * 
	 */
	export class InfoSystemParser extends AbstractParser implements IResponseParser {

		/**
		 * 
		 */
		public parse(data: Object): Object {
			return data;
		}
	}

}