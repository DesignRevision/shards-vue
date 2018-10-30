/**
 * Various constants used across the project.
 */

// Theme Colors
export const THEMECOLORS = [
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
    'dark'
];

/**
 * EVENTS
 */

// Accordion
export const COLLAPSE_EVENTS = {
    ACCORDION: 'collapse-accordion',
    TOGGLE: 'collapse-toggle',
    STATE: 'collapse-state'
}

// Modal events
export const MODAL_EVENTS = {
    HIDDEN: 'modal-hidden'
}

// Alert Events
export const ALERT_EVENTS = {
    DISMISS_COUNTDOWN: 'alert-dismiss-countdown',
    DISMISSED: 'alert-dismissed'
}

// Dropdown Events
export const DROPDOWN_EVENTS = {
    SHOWN: 'dropdown-shown',
    SHOW: 'dropdown-show',
    HIDE: 'dropdown-hide',
    HIDDEN: 'dropdown-hidden'
}

// Link Events
export const LINK_EVENTS = {
    CLICKED: 'link-clicked'
}

// All events
export const EVENTS = {
    MODAL: MODAL_EVENTS,
    ALERT: ALERT_EVENTS,
    DROPDOWN: DROPDOWN_EVENTS,
    LINK: LINK_EVENTS
}

/**
 * TOOLTIP / POPOVER
 */

// Tooltip / Popover placements
export const TP_PLACEMENTS = {
    TOP: 'top',
    TOPLEFT: 'topleft',
    TOPRIGHT: 'topright',
    RIGHT: 'right',
    RIGHTTOP: 'righttop',
    RIGHTBOTTOM: 'rightbottom',
    BOTTOM: 'bottom',
    BOTTOMLEFT: 'bottomleft',
    BOTTOMRIGHT: 'bottomright',
    LEFT: 'left',
    LEFTTOP: 'lefttop',
    LEFTBOTTOM: 'leftbottom',
    AUTO: 'auto'
}

// Normalized placements
export const N_TP_PLACEMENTS = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left',
    TOPLEFT: 'top',
    TOPRIGHT: 'top',
    RIGHTTOP: 'right',
    RIGHTBOTTOM: 'right',
    BOTTOMLEFT: 'bottom',
    BOTTOMRIGHT: 'bottom',
    LEFTTOP: 'left',
    LEFTBOTTOM: 'left'
}

// Tooltip/Popover offset map
export const TP_OFFSET_MAP = {
    AUTO: 0,
    TOPLEFT: -1,
    TOP: 0,
    TOPRIGHT: +1,
    RIGHTTOP: -1,
    RIGHT: 0,
    RIGHTBOTTOM: +1,
    BOTTOMLEFT: -1,
    BOTTOM: 0,
    BOTTOMRIGHT: +1,
    LEFTTOP: -1,
    LEFT: 0,
    LEFTBOTTOM: +1
}

// Popover state classes
export const TP_STATE_CLASSES = {
    FADE: 'fade',
    SHOW: 'show'
}

// Popover selectors
export const POPOVER_SELECTORS = {
    HEADER: '.popover-header',
    BODY: '.popover-body'
}

// Tooltip selectors
export const TOOLTIP_SELECTORS = {
    TOOLTIP: '.tooltip',
    TOOLTIP_INNER: '.tooltip-inner',
    ARROW: '.arrow'
}

// Tooltip hover state classes
export const TOOLTIP_HOVER_STATE_CLASSES = {
    SHOW: 'show',
    OUT: 'out'
}

/**
 * FORMS
 */

 export const INPUT_TYPES = [
     'text',
     'password',
     'email',
     'number',
     'tel',
     'url',
     'search',
     'range',
     'color',
     'date',
     'time',
     'datetime',
     'datetime-local',
     'month',
     'week',
     'file'
 ]

 /**
  * EMBEDS
  */

export const EMBED_TYPES = [
    'iframe',
    'video',
    'embed',
    'object',
    'img',
    'd-img'
]

export const EMBED_ASPECTS = [
    '21by9',
    '16by9',
    '4by3',
    '1by1'
]

// Keycodes
export const KEYCODES = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ENTER: 13,
    SPACE: 32
}
