import {create as XMLBuilder} from "xmlbuilder";
// Options NS
import {Options as OptionsNS} from "./AMCPConnectionOptions";
import ServerVersion = OptionsNS.ServerVersion;

/** */
export namespace Config {

	/** */
	export namespace v2xx {
		/** */
		export class CasparCGConfigVO {
			public channelGrid: boolean = false;
			public flash: v2xx.Flash = new v2xx.Flash();
			public templateHosts: Array<v2xx.TemplateHost> = [];
		}
		/** */
		export class Channel {
			public _type: string = "channel";
			public videoMode: string = "PAL";		// @todo: literal
			public consumers: Array<Consumer> = [];
			public straightAlphaOutput: boolean = false;
			public channelLayout: string = "stereo";
		}

		/** */
		export class Consumer {
			public _type: string;
		}

		/** */
		export class DecklinkConsumer extends Consumer {
			_type = "decklink";
			public device: number = 1;
			public keyDevice: Number | null = null;
			public embeddedAudio: boolean = false;
			public channelLayout: string = "stereo";
			public latency: string = "normal";		// @todo: literal
			public keyer: string = "external";		// @todo: literal
			public keyOnly: boolean = false;
			public bufferDepth: number = 3;
		}


		/** */
		export class BluefishConsumer extends Consumer {
			_type = "bluefish";
			public device: number = 1;
			public embeddedAudio: boolean = false;
			public channelLayout: string = "stereo";
			public keyOnly: boolean = false;
		}

		/** */
		export class SystemAudioConsumer extends Consumer {
			_type = "system-audio";
		}

		/** */
		export class ScreenConsumer extends Consumer {
			_type = "screen";
			public device: number = 1;		// @todo: wrong default implemented in caspar, should be 0:::
			public aspectRatio: string = "default";	// @todo: literal
			public stretch: string = "fill";			// @todo: literal
			public windowed: boolean = true;
			public keyOnly: boolean = false;
			public autoDeinterlace: boolean = true;
			public vsync: boolean = false;
			public borderless: boolean = false;
		}

		/** */
		export class NewtekIvgaConsumer extends Consumer {
			_type = "newtek-ivga";
		}

		/** */
		export class Controller {
			public _type: string = "tcp";
			public port: number | null = null;
			public protocol: string = "";
		}

		/** */
		export class Mixer {
			public blendModes: boolean = false;
			public straightAlpha: boolean = false;
			public mipmappingDefaultOn: boolean = false;
		}

		/** */
		export class OscClient {
			public _type: string = "predefined-client";
			public address: string = "";
			public port: number | null = null;
		}

		/** */
		export class Thumbnails {
			public generateThumbnails: boolean = true;
			public width: number = 256;
			public height: number = 144;
			public videoGrid: number = 2;
			public scanIntervalMillis: number = 5000;
			public generateDelayMillis: number = 2000;
			public mipmap: boolean = false;
			public videoMode: string = "720p5000";		// @todo: literal
		}

		/** */
		export class Flash {
			bufferDepth: string | number = "auto";
		}

		/** */
		export class TemplateHost {
			public _type: string = "template-host";
			public videoMode: string = "";				// @todo: literal
			public filename: string = "";
			public width: number | null = null;
			public height: number | null = null;
		}

		/**  */
		export class Osc {
			public defaultPort: number = 6250;
			public predefinedClients: Array<OscClient> = [];
		}

		/** */
		export const defaultAMCPController: v2xx.Controller = {_type: new v2xx.Controller()._type, port: 5250, protocol: "AMCP"};
	}

	/** */
	export namespace v207 {
		/** */
		export class CasparCGConfigVO extends v2xx.CasparCGConfigVO {
			public paths: v207.Paths = new v207.Paths();
			public channels: Array<v207.Channel> = [new v2xx.Channel()];
			public controllers: Array<v2xx.Controller> = [v2xx.defaultAMCPController];
			public mixer: v207.Mixer = new v207.Mixer();
			public logLevel: string = "trace";		// @todo: literal
			public autoDeinterlace: boolean = true;
			public autoTranscode: boolean = true;
			public pipelineTokens: number = 2;
			public thumbnails: v207.Thumbnails = new v207.Thumbnails();
			public osc: v2xx.Osc = new v2xx.Osc();
			public audio: v207.Audio = new v207.Audio();
		}

		/** */
		export class Channel {
			public consumers: Array<v207.Consumer> = [];
		}

		/** */
		export class Paths {
			mediaPath: string = "media\\";
			logPath: string = "log\\";
			dataPath: string = "data\\";
			templatePath: string = "templates\\";
			thumbnailsPath: string = "thumbnails\\";
		}

		/** */
		export class Consumer extends v2xx.Consumer {}

		/** */
		export class DecklinkConsumer extends v2xx.DecklinkConsumer {
			public customAllocator: boolean = true;
		}

		/** */
		export class BluefishConsumer extends v2xx.BluefishConsumer {}

		/** */
		export class SystemAudioConsumer extends v2xx.SystemAudioConsumer {}

		/** */
		export class ScreenConsumer extends v2xx.ScreenConsumer {
			public name: string = "Screen Consumer";
		}

		/** */
		export class NewtekIvgaConsumer extends v2xx.NewtekIvgaConsumer {
			public channelLayout: string = "stereo";
			public provideSync: boolean = true;
		}

		/** */
		export class FileConsumer extends v2xx.Consumer {
			_type = "file";
			public path: string = "";
			public vcodec: string = "libx264";
			public separateKey: boolean = false;
		}

		/** */
		export class StreamConsumer extends v2xx.Consumer {
			_type = "stream";
			public path: string = "";
			public args: string = "";
		}

		/** */
		export class Thumbnails extends v2xx.Thumbnails {}

		/** */
		export class Mixer extends v2xx.Mixer {
			public chromaKey: boolean = false;
		}

		/**  */
		export class Osc extends v2xx.Osc {}

		/**  */
		export class ChannelLayout {
			public _type: string = "channel-layout";
			public name: string = "";
			public type: string = "";
			public numChannels: number | null = null;
			public channels: string = "";
		}

		/**  */
		export class MixConfig {
			public _type: string = "mix-config";
			public from: string = "";
			public to: string = "";
			public mix: string = "";
			public mappings: Array<string> = [];
		}

		/**  */
		export class Audio {
			public channelLayouts: Array<v207.ChannelLayout> = [];
			public mixConfigs: Array<v207.MixConfig> = [];
		}
	}

	/** */
	export namespace v21x {
		export const defaultLOGController: v2xx.Controller = {_type: new v2xx.Controller()._type, port: 3250, protocol: "LOG"};

		/** */
		export class CasparCGConfigVO extends v2xx.CasparCGConfigVO {
			public paths: v21x.Paths = new v21x.Paths();
			public channels: Array<v21x.Channel> = [new v2xx.Channel()];
			public controllers: Array<v2xx.Controller> = [v2xx.defaultAMCPController, v21x.defaultLOGController];
			public lockClearPhrase: string = "secret";
			public mixer: v21x.Mixer = new v21x.Mixer();
			public logLevel: string = "info";					// @todo: literal
			public logCategories: string = "communication";	// @todo: literal or strongtype
			public forceDeinterlace: boolean = false;
			public accelerator: string = "auto";				// @todo: literal
			public thumbnails: v21x.Thumbnails = new v21x.Thumbnails();
			public html: v21x.Html = new v21x.Html();
			public osc: v21x.Osc = new v21x.Osc();
			public audio: v21x.Audio = new v21x.Audio();
		}

		/** */
		export class Channel {
			public consumers: Array<v21x.Consumer> = [];
		}

		/** */
		export class Paths {
			mediaPath: string = "media/";
			logPath: string = "log/";
			dataPath: string = "data/";
			templatePath: string = "template/";
			thumbnailPath: string = "thumbnail/";
			fontPath: string = "font/";
		}

		/** */
		export class Consumer extends v2xx.Consumer {}

		/** */
		export class DecklinkConsumer extends v2xx.DecklinkConsumer {}

		/** */
		export class BluefishConsumer extends v2xx.BluefishConsumer {}

		/** */
		export class SystemAudioConsumer extends v2xx.SystemAudioConsumer {
			public channelLayout: string = "stereo";
			public latency: number = 200;
		}

		/** */
		export class ScreenConsumer extends v2xx.ScreenConsumer {
			public interactive: boolean = true;
		}

		/** */
		export class NewtekIvgaConsumer extends v2xx.NewtekIvgaConsumer {}

		/** */
		export class FfmpegConsumer extends v2xx.Consumer {
			_type = "ffmpeg";
			public path: string = "";
			public args: string = "";
			public separateKey: boolean = false;
			public monoStreams: boolean = false;
		}

		/** */
		export class SynctoConsumer extends v2xx.Consumer {
			_type = "syncto";
			public channelId: Number | null = null;
		}

		/** */
		export class Mixer extends v2xx.Mixer {}

		/**  */
		export class Thumbnails extends v2xx.Thumbnails {
			public mipmap: boolean = true;
		}

		/** */
		export class Html {
			remoteDebuggingPort: number | null = null;
		}

		/**  */
		export class Osc extends v2xx.Osc {
			public disableSendToAmcpClients: boolean = false;
		}

		/**  */
		export class ChannelLayout {
			public _type: string = "channel-layout";
			public name: string = "";
			public type: string = "";
			public numChannels: number | null = null;
			public channelOrder: string = "";
		}

		/**  */
		export class MixConfig {
			public _type: string = "mix-config";
			public fromType: string = "";
			public toTypes: string = "";
			public mix: string = "";
		}

		/**  */
		export class Audio {
			public channelLayouts: Array<v21x.ChannelLayout> = [];
			public mixConfigs: Array<v21x.MixConfig> = [];
		}
	}

	/** */
	export namespace Intermediate {
		import Config207VO = v207.CasparCGConfigVO;
		import  Config210VO = v21x.CasparCGConfigVO;

		/** */
		export class Audio {
			public channelLayouts: Array<v21x.ChannelLayout> = [];
			public mixConfigs: Array<Intermediate.MixConfig> = [];
		}

		/**  */
		export class MixConfig {
			public _type: string = "mix-config";
			public fromType: string = "";
			public toTypes: string = "";
			public mix: {mixType: string, destinations: {[destination: string]: Array<{source: string, expression: string}>}};
		}

		/** */
		export class Mixer extends v207.Mixer { 
			chromaKey: boolean;
		}

		/** */
		export interface ICasparCGConfig {
			import(configVO: Object): void;
			importFromV207VO(configVO: Object): void;
			importFromV210VO(configVO: Object): void;
			readonly VO: v207.CasparCGConfigVO | v21x.CasparCGConfigVO;
			readonly v207VO: v207.CasparCGConfigVO;
			readonly v210VO: v21x.CasparCGConfigVO;
			readonly XML: Object | null;
			readonly v207XML: Object;
			readonly v210XML: Object;
			readonly XMLString: string;
			readonly v207XMLString: string;
			readonly v210XMLString: string;
			readonly _version: ServerVersion;

			paths: v21x.Paths;
			channels: Array<v2xx.Channel>;
			controllers: Array<v2xx.Controller>;
			lockClearPhrase: string | null;
			mixer: Intermediate.Mixer;
			logLevel: string;
			logCategories: string;
			channelGrid: boolean;
			forceDeinterlace: boolean;
			autoDeinterlace: boolean;
			autoTranscode: boolean;
			pipelineTokens: number;
			accelerator: string;
			thumbnails: v21x.Thumbnails;
			flash: v2xx.Flash;
			html: v21x.Html;
			templateHosts: Array<v2xx.TemplateHost>;
			osc: v2xx.Osc;
			audio: Intermediate.Audio;
		}

		/** */
		export class CasparCGConfig implements ICasparCGConfig {
			private __version: ServerVersion;
			public paths: v21x.Paths = new v21x.Paths();
			public channels: Array<v2xx.Channel> = [];
			public controllers: Array<v2xx.Controller> = [];
			public lockClearPhrase: string | null = null;
			public mixer: Intermediate.Mixer = new Intermediate.Mixer();
			public logLevel: string = "info";	// @todo literal
			public logCategories: string = "communication";	// @todo literal
			public channelGrid: boolean = false;
			public forceDeinterlace: boolean = false;
			public autoDeinterlace: boolean = true;
			public autoTranscode: boolean = true;
			public pipelineTokens: number = 2;
			public accelerator: string = "auto";	// @todo literal
			public thumbnails: v21x.Thumbnails = new v21x.Thumbnails;
			public flash: v2xx.Flash = new v2xx.Flash;
			public html: v21x.Html = new v21x.Html;
			public templateHosts: Array<v2xx.TemplateHost> = [];
			public osc: v21x.Osc = new v21x.Osc();
			public audio: Intermediate.Audio = new Intermediate.Audio();

			/** */
			public constructor(version: ServerVersion);
			public constructor(initConfigVO: Config207VO | Config210VO | {});
			public constructor(initVersionOrConfigVO: Config207VO | Config210VO | {} | ServerVersion) {
				// is a version
				if (typeof initVersionOrConfigVO === "number") {
					if (initVersionOrConfigVO >= 2100) {
						this.__version = ServerVersion.V210;
					} else if (initVersionOrConfigVO === 2007) {
						this.__version = ServerVersion.V207;
					}
					return;
				}
				// is initVO
				if (initVersionOrConfigVO) {
					if (initVersionOrConfigVO instanceof Config207VO) {
						this.__version = ServerVersion.V207;
					} else if (initVersionOrConfigVO instanceof Config210VO) {
						this.__version = ServerVersion.V210;
					} else if ((typeof initVersionOrConfigVO === "object") && initVersionOrConfigVO["_version"]) {
						if (initVersionOrConfigVO["_version"] >= 2100) {
							this.__version = ServerVersion.V210;
						} else if (initVersionOrConfigVO["_version"] >= 2007) {
							this.__version = ServerVersion.V207;
						}
					}
					this.import(initVersionOrConfigVO);
				}
			}

			/** */
			public import(configVO: Object): void {
				if (this.__version === ServerVersion.V207) {
					this.importFromV207VO(configVO);
				} else if (this.__version === ServerVersion.V210) {
					this.importFromV210VO(configVO);
				}

				// @todo: throw error
			}

			/** */
			public importFromV207VO(configVO: Object): void {
				configVO;
			}

			/** */
			public importFromV210VO(configVO: Object): void {
				// root level
				this.importValues(configVO, this, ["lockClear-phrase", "log-level", "log-categories", "force-deinterlace", "channel-grid", "accelerator"]);

				// paths
				this.importValues(configVO["paths"], this.paths, ["media-path", "log-path", "data-path", "template-path", "thumbnail-path", "font-path"]);

				// channels
				this.findListMembers(configVO, "channels").forEach((i) => {
					let channel: v2xx.Channel = new v2xx.Channel();
					this.importValues(i, channel, ["video-mode", "channel-layout", "straight-alpha-output"]);
					this.findListMembers(i, "consumers").forEach((o) => {
						let consumerName: string = CasparCGConfig.dashedToCamelCase(o["_type"]) + "Consumer";
						this.importListMembers(o, consumerName, v21x);
						channel.consumers.push(<v2xx.Consumer>o);
					});
					this.channels.push(channel);
				});

				// controllers
				this.findListMembers(configVO, "controllers").forEach((i) => {
					let controller: v2xx.Controller = new v2xx.Controller();
					this.importAllValues(i, controller);
					this.controllers.push(controller);
				});

				// mixer
				this.importValues(configVO["mixer"], this.mixer, ["blend-modes", "mipmapping-default-on", "straight-alpha"]);

				// templatehosts
				this.findListMembers(configVO, "template-hosts").forEach((i) => {
					let templateHost: v2xx.TemplateHost = new v2xx.TemplateHost();
					this.importAllValues(i, templateHost);
					this.templateHosts.push(templateHost);
				});

				// flash
				this.importValues(configVO["flash"], this.flash, ["buffer-depth"]);

				// html
				this.importValues(configVO["html"], this.html, ["remote-debugging-port"]);

				// thumbnails
				this.importValues(configVO["thumbnails"], this.thumbnails, ["generate-thumbnails", "width", "height", "video-grid", "scan-interval-millis", "generate-delay-millis", "video-mode", "mipmap"]);

				// osc
				this.importValues(configVO["osc"], this.osc, ["default-port", "disable-send-to-amcp-clients"]);
				this.findListMembers(configVO["osc"], "predefined-clients").forEach((i) => {
					let client: v2xx.OscClient = new v2xx.OscClient();
					this.importAllValues(i, client);
					this.osc.predefinedClients.push(client);
				});

				// audio
				if (configVO.hasOwnProperty("audio")) {
					if (configVO["audio"].hasOwnProperty("channelLayouts")) {
						this.audio.channelLayouts = configVO["audio"]["channelLayouts"];
					}
					if (configVO["audio"].hasOwnProperty("channelLayouts")) {
						this.audio.mixConfigs = new Array<Intermediate.MixConfig>();
						configVO["audio"]["mixConfigs"].forEach((i: v21x.MixConfig) => {
							let mixConfig: Intermediate.MixConfig = new Intermediate.MixConfig();
							mixConfig._type = i._type;
							mixConfig.fromType = i.fromType;
							mixConfig.toTypes = i.toTypes;

							let destinations: {[destination: string]: Array<{source: string, expression: string}>} = {};
							let mixType: string = i.mix.match(/\&lt\;|\</g) !== null ? "average" : "add";
							let src: string;
							let dest: string;
							let expr: string;
							i.mix.split("|").map((i) => i.replace(/^\s*|\s*$/g, "")).forEach((o) => {
								let srcDstSplit = o.split(/\&lt\;|\<|\=/);
								dest = srcDstSplit[0].replace(/^\s*|\s*$/g, "");
								destinations[dest] = [];
								srcDstSplit[1].split("+").forEach((u) => {
									let exprSplit: Array<string> = u.split("*");
									if (exprSplit.length > 1) {
										expr = exprSplit[0].replace(/^\s*|\s*$/g, "");
										src = exprSplit[1].replace(/^\s*|\s*$/g, "");
									}else {
										src = exprSplit[0].replace(/^\s*|\s*$/g, "");
										expr = "1.0";
									}
									destinations[dest].push({source: src, expression: expr});
								});
							});
							mixConfig.mix = {mixType: mixType, destinations: destinations};
							this.audio.mixConfigs.push(mixConfig);
						});
					}
				}
			}

			/** */
			public get VO(): Config207VO | Config210VO{
				if (this.__version === ServerVersion.V207) {
					return this.v207VO;
				} else if (this.__version === ServerVersion.V210) {
					return this.v210VO;
				}
				throw new Error("@todo");	// @todo: throw
			}

			/** */
			public get v207VO(): Config207VO {
				// let configVO: Config207VO = {};
				let configVO: Config207VO = new Config207VO;

				return configVO;
			}

			/** */
			public get v210VO(): Config210VO {
				let configVO: Config210VO = new Config210VO();

				// paths
				configVO.paths = this.paths;

				// channels
				configVO.channels = this.channels;

				// controllers
				configVO.controllers = this.controllers;

				// single values on root
				if (typeof this.lockClearPhrase === "string") configVO.lockClearPhrase = this.lockClearPhrase;
				configVO.logLevel = this.logLevel;
				configVO.logCategories = this.logCategories;
				configVO.forceDeinterlace = this.forceDeinterlace;
				configVO.channelGrid = this.channelGrid;
				configVO.accelerator = this.accelerator;

				// mixer
				configVO.mixer = new v21x.Mixer();
				configVO.mixer.blendModes = this.mixer.blendModes;
				configVO.mixer.mipmappingDefaultOn = this.mixer.mipmappingDefaultOn;
				configVO.mixer.straightAlpha = this.mixer.straightAlpha;

				// flash
				configVO.flash = this.flash;

				// html
				configVO.html = this.html;

				// template hosts
				configVO.templateHosts = this.templateHosts;

				// thumbnails
				configVO.thumbnails = this.thumbnails;

				// osc
				configVO.osc = this.osc;

				// audio
				configVO.audio = new v21x.Audio();
				configVO.audio.channelLayouts = this.audio.channelLayouts;
				this.audio.mixConfigs.forEach((i) => {
					let mixConfig: v21x.MixConfig = new v21x.MixConfig();
					mixConfig.fromType = i.fromType;
					mixConfig.toTypes = i.toTypes;
					let mixOperator: string;
					let destinationStrings: Array<string> = [];
					for (let o in i.mix.destinations) {
						let destinationSubStrings: Array<string> = [];
						let destinations = i.mix.destinations[o];
						mixOperator = (destinations.length > 1 && i.mix.mixType === "average") ? "<" : "=";
						destinations.forEach((u) => {
							destinationSubStrings.push(u.expression === "1.0" ? u.source : u.expression + "*" + u.source);
						});
						destinationStrings.push(o + " " + mixOperator + " " + destinationSubStrings.join(" + "));
					}
					mixConfig.mix = destinationStrings.join(" | ");
					configVO.audio.mixConfigs.push(mixConfig);
				});

				return configVO;
			}

			/** */
			public get XML(): Object | null {
				if (this.__version === ServerVersion.V207) {
					return this.v207XML;
				} else if (this.__version === ServerVersion.V210) {
					return this.v210XML;
				}
				return null; // @todo: throw error
			}

			/** */
			public get v207XML(): Object {
				let xml = XMLBuilder("configuration");

				return xml;
			}

			/** */
			public get v210XML(): Object {
				let xml = XMLBuilder("configuration");
					// paths
					CasparCGConfig.addFormattedXMLChildsFromObject(xml.ele("paths"), this.paths); // , ["mediaPath", "logPath", "dataPath", "templatePath", "thumbnailPath", "fontpath"]);

					// channels
					let channels = xml.ele("channels");
					this.channels.forEach((i) => {
						let channel = channels.ele("channel");
						CasparCGConfig.addFormattedXMLChildsFromObject(channel, i, ["_type", "consumers", "_consumers"]);

						// consumer
						let consumers = channel.ele("consumers");
						i.consumers.forEach((i) => {
							let consumer = consumers.ele(i._type);
							CasparCGConfig.addFormattedXMLChildsFromObject(consumer, i, ["_type"]);
						});
					});

					// controllers
					let controllers = xml.ele("controllers");
					this.controllers.forEach((i) => {
						let controller = controllers.ele(i._type);
						CasparCGConfig.addFormattedXMLChildsFromObject(controller, i, ["_type"]);
					});

					// all root-level single values
					CasparCGConfig.addFormattedXMLChildsFromArray(xml, this, ["lockClearPhrase", "logLevel", "logCategories", "forceDeinterlace", "channelGrid", "accelerator"]);

					// mixer
					if (this.mixer) {
						CasparCGConfig.addFormattedXMLChildsFromObject(xml.ele("mixer"), this.mixer);
					}

					// flash
					if (this.flash) {
						CasparCGConfig.addFormattedXMLChildsFromObject(xml.ele("flash"), this.flash);
					}

					// html
					if (this.html) {
						CasparCGConfig.addFormattedXMLChildsFromObject(xml.ele("html"), this.html);
					}

					// template hosts
					if (this.templateHosts && this.templateHosts.length > 0) {
						let templateHosts = xml.ele("template-hosts");
						this.templateHosts.forEach((i) => {
							let templatehost = templateHosts.ele(i._type);
							CasparCGConfig.addFormattedXMLChildsFromObject(templatehost, i, ["_type"]);
						});
					}

					// thumbnails
					if (this.thumbnails) {
						CasparCGConfig.addFormattedXMLChildsFromObject(xml.ele("thumbnails"), this.thumbnails);
					}

					// osc
					if (this.osc) {
						let osc = xml.ele("osc");
						osc.ele("default-port", this.osc.defaultPort);
						CasparCGConfig.addFormattedXMLChildsFromArray(osc, this.osc, ["defaultPort", "disableSendToAmcpClients"]);
						// predefined clients
						if (this.osc.predefinedClients && this.osc.predefinedClients.length > 0) {
							let predefinedClients = osc.ele("predefined-clients");
							this.osc.predefinedClients.forEach((i) => {
								predefinedClients;
								let client = predefinedClients.ele(i._type);
								CasparCGConfig.addFormattedXMLChildsFromObject(client, i, ["_type"]);
							});
						}
					}

					// audio
					if (this.audio && ((this.audio.channelLayouts && this.audio.channelLayouts.length > 0) || (this.audio.mixConfigs && this.audio.mixConfigs.length > 0))) {
						let audio = xml.ele("audio");
						if (this.audio.channelLayouts && this.audio.channelLayouts.length > 0) {
							let channelLayouts = audio.ele("channel-layouts");
							this.audio.channelLayouts.forEach((i) => {
								let channelLayout = channelLayouts.ele("channel-layout");
								if (i.name) channelLayout.att("name", i.name);
								if (i.type) channelLayout.att("type", i.type);
								if (i.numChannels) channelLayout.att("num-channels", i.numChannels);
								if (i.channelOrder) channelLayout.att("channel-order", i.channelOrder);
							});
						}
						if (this.audio.mixConfigs && this.audio.mixConfigs.length > 0) {
							let mixConfigs = audio.ele("mix-configs");
							this.audio.mixConfigs.forEach((i) => {

								let mixStrings: Array<string> = [];
								let mixOperator: string = i.mix.mixType === "average" ? "<" : i.mix.mixType === "add" ? "=" : "";
								let destination: Array<{source: string, expression: string}>;
								for (let o in i.mix.destinations) {
									destination = i.mix.destinations[o];
									if (destination.length > 1) {
										let subSourceStrings: Array<string> = [];
										destination.forEach((u) => {
											subSourceStrings.push(u.expression === "1.0" ? u.source : (u.expression.toString() + "*" + u.source));
										});
										mixStrings.push(o + " " + mixOperator + " " + subSourceStrings.join(" + "));
									} else {
										mixStrings.push(o + " = " + (destination[0].expression === "1.0" ? destination[0].source : (destination[0].expression.toString() + "*" + destination[0].source)));
									}
								}

								mixConfigs.ele("mix-config")
								.att("from-type", i.fromType)
								.att("to-types", i.toTypes)
								.att("mix", mixStrings.join(" | "));
							});
						}
					}
					return xml;
			}

			/** */
			public get XMLString(): string {
				if (this.__version === ServerVersion.V207) {
					return this.v207XMLString;
				} else if (this.__version === ServerVersion.V210) {
					return this.v210XMLString;
				}
				return ""; // @todo: throw error
			}

			/** */
			public get v207XMLString(): string {
				return this.v207XML["end"]({pretty: true});
			}

			/** */
			public get v210XMLString(): string {
				return this.v210XML["end"]({pretty: true});
			}

			/** */
			public get _version(): ServerVersion {
				return this.__version;
			}

			/** */
			private importAllValues(sourceRoot: Object, destRoot: Object): void {
				let values: Array<string> = [];
				for (let i in sourceRoot) {
					values.push(i);
				}
				this.importValues(sourceRoot, destRoot, values);
			}

			/** */
			private importValues(sourceRoot: Object, destRoot: Object, values: Array<string>): void {
				values.forEach((dashedKey) => {
					let camelKey = CasparCGConfig.dashedToMixedCase(dashedKey);
					// sets value if key is valid
					if (sourceRoot && sourceRoot.hasOwnProperty(dashedKey) && sourceRoot[dashedKey] !== undefined && sourceRoot[dashedKey] !== null) {
						if (destRoot.hasOwnProperty(camelKey)) {
							destRoot[camelKey] = sourceRoot[dashedKey];	// @todo: type checking/reflection/cast??
						}
					} else if (sourceRoot && sourceRoot.hasOwnProperty(camelKey) && sourceRoot[camelKey] !== undefined && sourceRoot[camelKey] !== null) {
						if (destRoot.hasOwnProperty(camelKey)) {
							destRoot[camelKey] = sourceRoot[camelKey];	// @todo: type checking/reflection/cast??
						}
					}
				});
			}

			/** */
			private findListMembers(root: Object, childKey: string): Array<Object> {
				let pairs: Array<Array<any>> = [];
				for (let i in root) {
					pairs.push([i, root[i]]);
				}
				for (let i of pairs){
					let outerKey: string = i[0].toString();
					let outerValue: Object = i[1];
					// filter top-level possible arrays
					if (childKey === outerKey) {
						let flatArray: Array<Object> = [];
						for (let innerKey in outerValue) {
							let innerValue: Object = outerValue[innerKey];
							if (typeof innerValue === "object") {
								if (Array.isArray(innerValue)) { // multiple innervalues
									innerValue.forEach((o: Object) => {
										if (typeof o !== "object") {	// "" string values, i.e. empty screen consumers
											o = {};
										}
										o["_type"] = innerKey;
										flatArray.push(o);
									});
								} else { // single inner object
									innerValue["_type"] = innerKey;
									flatArray.push(innerValue);
								}
							// update outer member with transformed array of inner members
							}else {
								flatArray.push({_type: innerKey});
							}
						}
						return flatArray;
					}
				}
				return [];
			}

			/** */
			private importListMembers(root: Object, memberName: string, restrictedNamespace?: Object) {
				let namespace: Object | undefined;
				if (restrictedNamespace) {
					namespace = restrictedNamespace;
				}else {
					if (v21x[memberName]) {
						namespace = v2xx;
					} else if (v207[memberName]) {
						namespace = v207;
					} else if (v2xx[memberName]) {
						namespace = v2xx;
					}
				}
				if (namespace) {
					let member: v2xx.Consumer = Object.create(namespace[memberName]["prototype"]);
					member.constructor.call(member);
					this.importAllValues(root, member);
				}
			}

			/** */
			static addFormattedXMLChildsFromObject(root: Object, data: Object, blacklist?: Array<string>): Object {
				blacklist && blacklist.push("arrayNo", "array-no");
				for (let key in data) {
					if ((key === "constructor") || (blacklist && blacklist.indexOf(key) > -1)) {
						continue;
					}
					let value: string = data[key];
					if (value !== null && value !== "") {
						key = CasparCGConfig.mixedCaseToDashed(key);
						root["ele"].call(root, key, value);
					}
				}
				return root;
			}

			/** */
			static addFormattedXMLChildsFromArray(root: Object, data: Object, whitelist?: Array<string>): Object {
				if (whitelist) {
					whitelist.forEach((key) => {
						if (data.hasOwnProperty(key)) {
							let value: string = data[key];
							if (value !== null && value !== "") {
								let keyBlocks: Array<string> = key.split(/(?=[A-Z])/);
								key = keyBlocks.map((i) => i.toLowerCase()).join("-");
								root["ele"].call(root, key, value);
							}
						}
					});
				}
				return root;
			}

			/** */
			static dashedToMixedCase(dashedString: string): string {
				let keyBlocks: Array<string> = dashedString.split(/-/);
				return keyBlocks.map((i, o) => {
					if (o > 0) {
						i = i.toLowerCase();
						i = i.slice(0, 1).toUpperCase() + i.slice(1);
					}else {
						i = i.toLowerCase();
					}
					return i;
				}).join("");
			}

			/** */
			static dashedToCamelCase(dashedString: string): string {
				let keyBlocks: Array<string> = dashedString.split(/-/);
				return keyBlocks.map((i) => {
					i = i.toLowerCase();
					i = i.slice(0, 1).toUpperCase() + i.slice(1);
					return i;
				}).join("");
			}

			/** */
			static mixedCaseToDashed(mixedCased: string): string {
				let keyBlocks: Array<string> = mixedCased.split(/(?=[A-Z])/);
				return keyBlocks.map((i) => i.toLowerCase()).join("-");
			}
		}

	}
}	