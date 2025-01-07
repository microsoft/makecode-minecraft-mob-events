//% block="Mob Events" weight=55
//% color="#7e42f5" icon="\uf1b0"
namespace mobEvents {
    export enum _EntitySelectorArgument {
        Type,
        Limit,
        X,
        Y,
        Z,
        DX,
        DY,
        DZ,
        MaxRadius,
        MinRadius
    }

    export class _EntitySelectorRule {
        constructor(public argument: string, public value: string) {}
    }

    export class EntitySelector {
        protected rules: _EntitySelectorRule[]
        protected from: Position;
        protected to: Position;

        constructor() {
            this.rules = [];
        }

        toString() {
            const savedRules = this.rules.slice();

            if (this.from) {
                const f = this.from.toWorld();

                this._setRule(_EntitySelectorArgument.X, f.getValue(Axis.X));
                this._setRule(_EntitySelectorArgument.Y, f.getValue(Axis.Y));
                this._setRule(_EntitySelectorArgument.Z, f.getValue(Axis.Z));

                if (this.to) {
                    const t = this.to.toWorld();

                    this._setRule(_EntitySelectorArgument.DX, t.getValue(Axis.X) - f.getValue(Axis.X));
                    this._setRule(_EntitySelectorArgument.DY, t.getValue(Axis.Y) - f.getValue(Axis.Y));
                    this._setRule(_EntitySelectorArgument.DZ, t.getValue(Axis.Z) - f.getValue(Axis.Z));
                }
            }

            const selector = this.rules.length > 0
                ? `@e[${this.rules.map(r => `${r.argument}=${r.value}`).join(",")}]`
                : "@e"

            this.rules = savedRules;

            return selector;
        }

        _setRule(rule: _EntitySelectorArgument, value: string | number) {
            if (typeof value === "number") {
                value = Math.round(value) + "";
            }

            let arg = "";
            switch (rule) {
                case _EntitySelectorArgument.Type:
                    arg = "type";
                    break;
                case _EntitySelectorArgument.Limit:
                    arg = "c";
                    break;
                case _EntitySelectorArgument.X:
                    arg = "x";
                    break;
                case _EntitySelectorArgument.Y:
                    arg = "y";
                    break;
                case _EntitySelectorArgument.Z:
                    arg = "z";
                    break;
                case _EntitySelectorArgument.DX:
                    arg = "dx";
                    break;
                case _EntitySelectorArgument.DY:
                    arg = "dy";
                    break;
                case _EntitySelectorArgument.DZ:
                    arg = "dz";
                    break;
                case _EntitySelectorArgument.MaxRadius:
                    arg = "r";
                    break;
                case _EntitySelectorArgument.MinRadius:
                    arg = "rm";
                    break;
                default:
                    player.errorMessage("Unknown entity selector rule");
                    return;
            }

            for (const rule of this.rules) {
                if (rule.argument === arg) {
                    rule.value = value;
                    return;
                }
            }

            this.rules.push(new _EntitySelectorRule(arg, value));
        }

        _setPosition(from: Position, to?: Position) {
            this.from = from;
            this.to = to;
        }
    }

    export function executeMobEvent(selector: EntitySelector, event: string) {
        player.execute(`event entity ${selector.toString()} ${event}`);
    }

    //% blockId=mob_events_create_selector
    //% block="all entities"
    //% group="Selectors"
    //% weight=100
    export function createSelector() {
        return new EntitySelector();
    }

    //% blockId=mob_events_setVolume
    //% block="set $selector area from $from to $to"
    //% selector.shadow=variables_get
    //% selector.defl=myEntitySelector
    //% from.shadow=minecraftCreatePosition
    //% to.shadow=minecraftCreatePosition
    //% group="Selectors"
    //% weight=90
    export function setVolume(selector: EntitySelector, from: Position, to: Position) {
        selector._setPosition(from, to);
    }

    //% blockId=mob_events_setPosition
    //% block="set $selector position $position"
    //% selector.shadow=variables_get
    //% selector.defl=myEntitySelector
    //% position.shadow=minecraftCreatePosition
    //% group="Selectors"
    //% weight=80
    export function setPosition(selector: EntitySelector, position: Position) {
        selector._setPosition(position);
    }

    //% blockId=mob_events_setMaxRadius
    //% block="set $selector max radius $radius"
    //% selector.shadow=variables_get
    //% selector.defl=myEntitySelector
    //% radius.min=0
    //% group="Selectors"
    //% weight=70
    export function setMaxRadius(selector: EntitySelector, radius: number) {
        selector._setRule(_EntitySelectorArgument.MaxRadius, radius)
    }

    //% blockId=mob_events_setMinRadius
    //% block="set $selector min radius $radius"
    //% selector.shadow=variables_get
    //% selector.defl=myEntitySelector
    //% radius.min=0
    //% group="Selectors"
    //% weight=60
    export function setMinRadius(selector: EntitySelector, radius: number) {
        selector._setRule(_EntitySelectorArgument.MinRadius, radius)
    }

    //% blockId=mob_events_setLimit
    //% block="set $selector max entities selected limit $limit"
    //% selector.shadow=variables_get
    //% selector.defl=myEntitySelector
    //% group="Selectors"
    //% weight=50
    export function setLimit(selector: EntitySelector, limit: number) {
        selector._setRule(_EntitySelectorArgument.Limit, limit);
    }
}