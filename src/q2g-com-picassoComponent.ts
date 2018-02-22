//#region Imports
import * as template                        from "text!./q2g-com-picassoComponent.html";
import * as picassoImport                   from "../node_modules/picasso.js/dist/picasso";
import * as picassoQ                        from "../node_modules/picasso-plugin-q/dist/picasso-q";
//#endregion

//#region declaration of const
const picasso: any = picassoImport;
picasso.use(picassoQ);
let timer;
let inputCounter = 0;
//#endregion

//#region interfaces
interface IPicassoData {
    type: string;
    key: string;
    data: EngineAPI.IHyperCube;
}
//#endregion

class PicassoExecutorController {

    //#region variables
    chartElement: Element;
    codeFcn: Function;
    element: JQuery;
    parseError: boolean = false;
    qlikError: boolean = false;
    picassoChart: any;
    picassoData: IPicassoData[];
    timeout: ng.ITimeoutService;
    //#endregion

    //#region code
    private _code: string;
    public get code() : string {
        return this._code;
    }
    public set code(v : string) {
        if (v !== this._code) {
            inputCounter++;
            this._code = v;
            try {
                this.codeFcn = Function("picasso", "data", "element", "settings", v);
                this.parseError = false;
            } catch (e) {
                this.codeFcn = null;
                this.parseError = true;
            }
            this.chartElement = this.element.children()[0];
            this.refreshChart();
        }
    }
    //#endregion

    //#region settings
    private _settings: EngineAPI.IGenericObjectProperties;
    public get settings() : EngineAPI.IGenericObjectProperties {
        return this._settings;
    }
    public set settings(v : EngineAPI.IGenericObjectProperties) {
        if (this._settings !== v) {
            this._settings = v;
            this.refreshChart();
        }
    }
    //#endregion

    //#region model
    private _model: EngineAPI.IGenericObject;
    get model(): EngineAPI.IGenericObject {
        return this._model;
    }
    set model(v: EngineAPI.IGenericObject) {
        if (v !== this._model) {
            try {
                this._model = v;
                let that = this
                v.on("changed", function () {
                    this.getLayout()
                        .then((res) => {
                            that.picassoData = [{
                                type: "q",
                                key: "qHyperCube",
                                data: res.qHyperCube
                            }];
                            that.refreshChart();
                        })
                    .catch((error) => {
                        console.error(error);
                    });
                });
                v.emit("changed");
            } catch (e) {
                console.error(e);
            }
        }
    }
    //#endregion

    //#region constructor
    static $inject = ["$timeout", "$element", "$transclude", "$scope"];

    constructor(timeout: ng.ITimeoutService, element: JQuery, transclude: ng.ITranscludeFunction, scope: ng.IScope) {
        this.timeout = timeout;
        this.element = element;

        transclude((script) => {
            this.code = script[1].nodeValue;
        })

        scope.$watch(() => {
            return this.element.height() * this.element.width();
        }, () => {
            this.refreshChart();
        });
    }
    //#endregion

    private refreshChart(check?: boolean): Promise<boolean> {
        clearTimeout(timer);
        return new Promise((resolve, reject) => {

            timer = setTimeout(() => {
                if (this.checkIfChartReqirementsExists()) {
                    this.settingParser(this.settings)
                        .then((settings) => {
                            this.picassoChart = this.codeFcn(picasso, this.picassoData, this.chartElement, settings);
                            this.qlikError = false
                            resolve(true);
                        })
                    .catch((error) => {
                        this.qlikError = true;
                        reject();
                    });
                }

                resolve(false);
             }, (inputCounter>2?500:40));

        });
    }

    private checkIfChartReqirementsExists() {
        if (typeof(this.settings) !== "undefined" &&
            typeof(this.code) !== "undefined" &&
            typeof(this.model) !== "undefined" &&
            typeof(this.element) !== "undefined" &&
            !this.parseError) {

            return true;
        }
        return false;
    }

    private settingParser(settings: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            for (const key in settings) {
                let float = parseFloat(settings[key]);
                if (settings.hasOwnProperty(key) && !isNaN(float)) {
                    settings[key] = float;
                }
            }
            resolve(settings);
        });
    }
}

export = {
    componentName: "q2gComPicasso",
    restrict: 'E',
    replace: true,
    template: template,
    controller: PicassoExecutorController,
    controllerAs: "vm",
    transclude: true,
    scope: {},
    bindToController: {
        model: "<",
        settings: "<"
    }
}
