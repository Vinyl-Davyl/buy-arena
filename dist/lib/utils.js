"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructMetadata = exports.formatPrice = exports.cn = void 0;
var clsx_1 = require("clsx");
var tailwind_merge_1 = require("tailwind-merge");
function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
exports.cn = cn;
function formatPrice(price, options) {
    if (options === void 0) { options = {}; }
    var _a = options.currency, currency = _a === void 0 ? "USD" : _a, _b = options.notation, notation = _b === void 0 ? "compact" : _b;
    var numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        notation: notation,
        maximumFractionDigits: 2,
    }).format(numericPrice);
}
exports.formatPrice = formatPrice;
function constructMetadata(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.title, title = _c === void 0 ? "BuyArena - the marketplace for digital assets" : _c, _d = _b.description, description = _d === void 0 ? "DigitalHippo is an open-source marketplace for high-quality digital goods." : _d, _e = _b.image, image = _e === void 0 ? "/thumbnail.png" : _e, _f = _b.icons, icons = _f === void 0 ? "/favicon.ico" : _f, _g = _b.noIndex, noIndex = _g === void 0 ? false : _g;
    return __assign({ title: title, description: description, openGraph: {
            title: title,
            description: description,
            images: [
                {
                    url: image,
                },
            ],
        }, twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [image],
            creator: "@Vinylchi",
        }, icons: icons, metadataBase: new URL("https://buy-arena.vercel.app") }, (noIndex && {
        robots: {
            index: false,
            follow: false,
        },
    }));
}
exports.constructMetadata = constructMetadata;
