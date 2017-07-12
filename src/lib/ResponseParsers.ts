import *as Path from "path";
import {Options as OptionsNS} from "./AMCPConnectionOptions";
// Options NS
import ServerVersion = OptionsNS.ServerVersion;
// config NS
import {Config as ConfigNS} from "./Config";
import CasparCGConfig = ConfigNS.Intermediate.CasparCGConfig;
export namespace Response {

	/***/
	export class CasparCGPaths {
		media: string;
		data: string;
		log: string;
		template: string;
		thumbnail: string;
		font?: string | undefined;
		root: string;

		/***/
		get thumbnails(): string {
			return this.thumbnail;
		}

		/***/
		get absoluteMedia(): string{
			return this.absolutePath(this.media);
		}

		/***/
		get absoluteData(): string {
			return this.absolutePath(this.data);
		}

		/***/
		get absoluteLog(): string {
			return this.absolutePath(this.log);
		}

		/***/
		get absoluteTemplate(): string {
			return this.absolutePath(this.template);
		}

		/***/
		get absoluteThumbnail(): string {
			return this.absolutePath(this.thumbnail);
		}

		/***/
		get absoluteThumbnails(): string {
			return this.absolutePath(this.thumbnails);
		}

		/***/
		get absoluteFont(): string | undefined {
			return this.font ? this.absolutePath(this.font) : undefined;
		}

		/***/
		private absolutePath(relativeOrAbsolutePath: string): string {
			if (relativeOrAbsolutePath.match(/\:\\|\:\//)) {
				return CasparCGPaths.ensureTrailingSlash(relativeOrAbsolutePath);
			}

			return CasparCGPaths.ensureTrailingSlash(Path.join(this.root, relativeOrAbsolutePath));
		}

		/***/
		static ensureTrailingSlash(path: string): string {
			return ((path.slice(-1) === "/" || path.slice(-1) === "\\") ? path : path + "/");
		}
	}

	/***/
	export class ChannelRate {

		public channelRate: number;
		public frameRate: number;
		public isInterlaced: boolean;

		/***/
		constructor(rateExpression: string) {
			this.isInterlaced = rateExpression.indexOf("i") > -1;
			let rateMatch: RegExpMatchArray | null = rateExpression.match(/[0-9]+$/);
			let rate: number = 0;
			if (rateMatch) {
				rate = +rateMatch[0];
			}

			if (rate === 5994) {
				this.channelRate = 60 * 1000 / 1001;
				this.frameRate = this.isInterlaced ? 30 * 1000 / 1001 : this.channelRate;
			} else if (rateExpression.toLowerCase() === "pal") {
				this.isInterlaced = true;
				this.channelRate = 50;
				this.frameRate = 25;
			} else if (rateExpression.toLowerCase() === "ntsc") {
				this.isInterlaced = true;
				this.channelRate = 60 * 1000 / 1001;
				this.frameRate = 30 * 1000 / 1001;
			} else {
				this.channelRate = rate / 100;
				this.frameRate = this.isInterlaced ? rate / 200 : this.channelRate;
			}
		}
	}

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
		public parse(data: any): Object {
			data = [].concat(data);
			let result: Array<Object> = [];
			(<Array<Object>>data).forEach((channel) => {
				let components: Array<string> = channel.toString().split(/\s|,/);

				let i: number = +components.shift()!;
				let format: string = components.shift() || "";
				let rates: ChannelRate = new ChannelRate(format);

				result.push({channel: i, format: format.toLowerCase(), channelRate: rates.channelRate, frameRate: rates.frameRate, interlaced: rates.isInterlaced});
			});

			if (result.length > 0) {
				return result;
			}

			return {};
		}
	}

	/***/
	export class ConfigParser extends AbstractParser implements IResponseParser {
		/***/
		public parse(data: Object): Object {
			let serverVersion: ServerVersion;
			if (this.context && this.context.hasOwnProperty("serverVersion") && this.context["serverVersion"] > ServerVersion.V21x) {
				serverVersion = ServerVersion.V210;
			}else {
				serverVersion = ServerVersion.V207;
			}
			let configResult: CasparCGConfig = new CasparCGConfig(serverVersion);
			configResult.import(data);
			return configResult;
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
	export class ContentParser extends AbstractParser implements IResponseParser {

		static parseTimeString(timeDateString: string): number {

				timeDateString = timeDateString.replace(/[tT]/g, "");

				let year: number = parseInt(timeDateString.slice(0, 4));
				let month: number = parseInt(timeDateString.slice(4, 6));
				let date: number = parseInt(timeDateString.slice(6, 8));
				let hours: number = parseInt(timeDateString.slice(8, 10));
				let minutes: number = parseInt(timeDateString.slice(10, 12));
				let seconds: number = parseInt(timeDateString.slice(12, 14));
				return new Date(year, month, date, hours, minutes, seconds).getTime();
		}

		/**
		 *
		 */
		public parse(data: Array<string>): Object {
			return data.map((i: string) => {
				let components: RegExpMatchArray|null = i.match(/\"([\s\S]*)\" +([\s\S]*)/);

				if (components === null) {
					return null;
				}

				let name: string = components[1].replace(/\\/g, "/");
				let typeData: Array<string> = components[2].split(/\s+/);

				// is font
				if (typeData.length === 1) {
					return {name: name,
							type: "font",
							fileName: typeData[0].replace(/\"/g, "")
					};
				 }

				// is 2.1.0 template
				if (typeData.length === 3) {
					return {name: name,
						type: "template",
						size: parseInt(typeData[0]),
						changed: ContentParser.parseTimeString(typeData[1]),
						format: typeData[2]
					};
				}

				// is 2.0.7 template
				if (typeData.length === 2) {
					return {name: name,
						type: "template",
						size: parseInt(typeData[0]),
						changed: ContentParser.parseTimeString(typeData[1]),
					};
				}

				// is media

				let frames: number = parseInt(typeData[3]);
				let frameRate: number = 0;
				let duration: number = 0;
				let frameTimeSegments: Array<string> = typeData[4].split("/");
				if (frameTimeSegments[0] !== "0") {
					frameRate = +(parseInt(frameTimeSegments[1]) / parseInt(frameTimeSegments[0])).toFixed(2);
					duration = Math.round((frames / frameRate) * 100) / 100;
				}

				return {name: name,
						type: typeData[0].toLowerCase() === "movie" ? "video" : typeData[0].toLowerCase() === "still" ? "image" : typeData[0].toLowerCase(),
						size: parseInt(typeData[1]),
						changed: ContentParser.parseTimeString(typeData[2]),
						frames: frames,
						frameTime: typeData[4],
						frameRate: frameRate,
						duration: duration
					};
			});
		}
	}

		/**
	 *
	 */
	export class ThumbnailListParser extends AbstractParser implements IResponseParser {

		/**
		 *
		 */
		public parse(data: Array<string>): Object {
			return data.map((i: string) => {
				let components: RegExpMatchArray|null = i.match(/\"([\s\S]*)\" +([\s\S]*)/);

				if (components === null) {
					return null;
				}

				let name: string = components[1].replace(/\\/g, "/");
				let typeData: Array<string> = components[2].split(/\s+/);

				return {
					name: name,
					type: "thumbnail",
					changed: ContentParser.parseTimeString(typeData[0]),
					size: parseInt(typeData[1]),
				};
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
			if (data && Array.isArray(data)) {
				let components: RegExpMatchArray|null = data[0].match(/\"([\s\S]*)\" +([\s\S]*)/);

				if (components === null) {
					return {};
				}

				// let name: string = components[1].replace(/\\/g, "/");
				let typeData: Array<string> = components[2].split(/\s+/);
			return {size: parseInt(typeData[1]), changed: typeData[2], duration: parseInt(typeData[3]), fps: typeData[4]};
			}
			return {};
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
			let paths = new CasparCGPaths();

			if (data.hasOwnProperty("initial-path")) {
				paths.root = data["initial-path"];
			}

			if (data.hasOwnProperty("media-path")) {
				paths.media = data["media-path"];
			}

			if (data.hasOwnProperty("data-path")) {
				paths.data = data["data-path"];
			}

			if (data.hasOwnProperty("log-path")) {
				paths.log = data["log-path"];
			}

			if (data.hasOwnProperty("template-path")) {
				paths.template = data["template-path"];
			}

			if (data.hasOwnProperty("thumbnails-path")) {
				paths.thumbnail = data["thumbnails-path"];
			}

			if (data.hasOwnProperty("thumbnail-path")) {
				paths.thumbnail = data["thumbnail-path"];
			}

			if (data.hasOwnProperty("font-path")) {
				paths.font = data["font-path"];
			}

			return paths;
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

			// wrap devices in arrays (if single device of a type)
			if (data.hasOwnProperty("decklink") && data["decklink"].hasOwnProperty("device")) {
				if (!Array.isArray(data["decklink"]["device"])) {
					data["decklink"]["device"] = [data["decklink"]["device"]];
				}
			}
			if (data.hasOwnProperty("bluefish") && data["bluefish"].hasOwnProperty("device")) {
				if (!Array.isArray(data["bluefish"]["device"])) {
					data["bluefish"]["device"] = [data["bluefish"]["device"]];
				}
			}
			return data;
		}
	}

}