const markoWidgets = require('marko-widgets');
const emitAndFire = require('../../common/emit-and-fire');
const eventUtils = require('../../common/event-utils');
const processHtmlAttributes = require('../../common/html-attributes');
const observer = require('../../common/property-observer');
const template = require('./template.marko');

function getInitialState(input) {
    const href = input.href;
    const priority = input.priority || 'secondary';
    const size = input.size;
    const noText = input.noText;
    const fluid = input.fluid;
    let variant = input.variant;
    let tag;
    let mainClass = 'btn';

    if (href) {
        variant = 'fake';
        tag = 'a';
    } else {
        tag = 'button';
    }

    const isExpandVariant = variant === 'expand';
    const isCtaVariant = variant === 'cta';
    const isIconVariant = variant === 'icon';
    const isBadged = Boolean(input.badgeNumber && isIconVariant);
    const hasAriaLabel = Boolean(input['*'] && input['*'].ariaLabel);

    if (href || isExpandVariant || isCtaVariant || isIconVariant) {
        mainClass = `${variant}-${mainClass}`;
    }

    const classes = [mainClass, input.class];

    if (!isIconVariant && !isBadged && (priority === 'primary' || priority === 'secondary')) {
        classes.push(`${mainClass}--${priority}`);
    }

    if (!isBadged && (size === 'small' || size === 'large')) {
        classes.push(`${mainClass}--${size}`);
    }

    if (isIconVariant || isBadged || (isExpandVariant && noText)) {
        classes.push(`${mainClass}--no-text`);
    }

    if (fluid) {
        classes.push(`${mainClass}--fluid`);
    }

    if (isBadged) {
        classes.push(`${mainClass}--badged`);
    }

    return {
        htmlAttributes: processHtmlAttributes(input),
        classes,
        style: input.style,
        tag,
        href,
        type: input.type || 'button',
        disabled: Boolean(input.disabled),
        partiallyDisabled: input.partiallyDisabled ? 'true' : null, // for aria-disabled
        isBadged,
        hasAriaLabel,
        badgeNumber: input.badgeNumber,
        badgeAriaLabel: input.badgeAriaLabel
    };
}

function getTemplateData(state) {
    return state;
}

function init() {
    observer.observeRoot(this, ['disabled']);
}

function handleClick(originalEvent) {
    if (!this.state.disabled) {
        emitAndFire(this, 'button-click', { originalEvent });
    }
}

/**
 * Handle a11y features
 * https://ebay.gitbooks.io/mindpatterns/content/input/button.html#keyboard
 * @param {MouseEvent} e
 */
function handleKeydown(originalEvent) {
    eventUtils.handleActionKeydown(originalEvent, () => {
        this.handleClick(originalEvent);
    });
    eventUtils.handleEscapeKeydown(originalEvent, () => {
        if (!this.state.disabled) {
            emitAndFire(this, 'button-escape', { originalEvent });
        }
    });
}

module.exports = markoWidgets.defineComponent({
    template,
    getInitialState,
    getTemplateData,
    init,
    handleClick,
    handleKeydown
});
