import * as mc from "mojang-minecraft";
import * as ui from "mojang-minecraft-ui";
export class ActionForm {
    constructor() {
        this.actionForm = new ui.ActionFormData();
    }
    addButton(label, icon) {
        this.actionForm.button(label, icon ? icon : null);
    }
    addButtons(buttons) {
        for (let i = 0; i < buttons.length; i++) {
            this.actionForm.button(...buttons[i]);
        }
    }
    setTitle(text) {
        this.actionForm.title(text);
    }
    setBody(text) {
        this.actionForm.body(text);
    }
    show(player, callback, tickDelay = 3) {
        // console.warn('1')
        let actionForm = this.actionForm;
        let ticks = 0;
        let tickEvent = mc.world.events.tick.subscribe(() => {
            // console.warn('2')
            ticks++;
            if (ticks > tickDelay - 1) {
                // console.warn('3')
                mc.world.events.tick.unsubscribe(tickEvent);
                actionForm.show(player).then(callback);
            }
        });
    }
}
export class MessageForm {
    constructor() {
        this.msgForm = new ui.MessageFormData();
    }
    buttons(text1, text2) {
        this.msgForm.button1(text1);
        this.msgForm.button2(text2);
    }
    button1(text) {
        this.msgForm.button1(text);
    }
    button2(text) {
        this.msgForm.button2(text);
    }
    setTitle(text) {
        this.msgForm.title(text);
    }
    setBody(text) {
        this.msgForm.body(text);
    }
    show(player, callback, tickDelay = 3) {
        let msgForm = this.msgForm;
        let ticks = 0;
        let tickEvent = mc.world.events.tick.subscribe(() => {
            ticks++;
            if (ticks % tickDelay == 0) {
                mc.world.events.tick.unsubscribe(tickEvent);
                msgForm.show(player).then(callback);
            }
        });
    }
}
export class ModalForm {
    constructor() {
        this.modalForm = new ui.ModalFormData();
    }
    setTitle(text) {
        this.modalForm.title(text);
    }
    dropdown(label, options, defaultValueIndex = 0) {
        this.modalForm.dropdown(label, options, defaultValueIndex);
    }
    icon(iconPath) {
        this.modalForm.icon(iconPath);
    }
    slider(label, minimumValue, maximumValue, valueStep, defualtValue) {
        this.modalForm.slider(
            label,
            minimumValue,
            maximumValue,
            valueStep,
            defualtValue
        );
    }
    textField(label, placeholderText, defaultValue = null) {
        this.modalForm.textField(label, placeholderText, defaultValue);
    }
    toggle(label, defaultValue = false) {
        this.modalForm.toggle(label, defaultValue);
    }
    show(player, callback, tickDelay = 3) {
        let modalForm = this.modalForm;
        let ticks = 0;
        let tickEvent = mc.world.events.tick.subscribe(() => {
            ticks++;
            if (ticks > tickDelay - 1) {
                mc.world.events.tick.unsubscribe(tickEvent);
                modalForm.show(player).then(callback);
            }
        });
    }
}
