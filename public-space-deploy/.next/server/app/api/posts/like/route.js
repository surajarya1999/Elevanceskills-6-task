/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/posts/like/route";
exports.ids = ["app/api/posts/like/route"];
exports.modules = {

/***/ "(rsc)/./app/api/posts/like/route.ts":
/*!*************************************!*\
  !*** ./app/api/posts/like/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_mongodb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/mongodb */ \"(rsc)/./lib/mongodb.ts\");\n/* harmony import */ var _models_Post__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/models/Post */ \"(rsc)/./models/Post.ts\");\n\n\n\nasync function POST(req) {\n    try {\n        await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_1__.connectDB)();\n        const { postId, userId } = await req.json();\n        if (!postId || !userId) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            message: \"postId and userId required\"\n        }, {\n            status: 400\n        });\n        const post = await _models_Post__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findById(postId);\n        if (!post) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            message: \"Post not found\"\n        }, {\n            status: 404\n        });\n        const alreadyLiked = post.likes.includes(userId);\n        if (alreadyLiked) {\n            post.likes = post.likes.filter((id)=>id !== userId);\n        } else {\n            post.likes.push(userId);\n        }\n        await post.save();\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            liked: !alreadyLiked,\n            likesCount: post.likes.length\n        });\n    } catch  {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            message: \"Server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3Bvc3RzL2xpa2Uvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUF3RDtBQUNkO0FBQ1Q7QUFFMUIsZUFBZUcsS0FBS0MsR0FBZ0I7SUFDekMsSUFBSTtRQUNGLE1BQU1ILHVEQUFTQTtRQUNmLE1BQU0sRUFBRUksTUFBTSxFQUFFQyxNQUFNLEVBQUUsR0FBRyxNQUFNRixJQUFJRyxJQUFJO1FBQ3pDLElBQUksQ0FBQ0YsVUFBVSxDQUFDQyxRQUFRLE9BQU9OLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7WUFBRUMsU0FBUztZQUFPQyxTQUFTO1FBQTZCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO1FBRTFILE1BQU1DLE9BQU8sTUFBTVQsb0RBQUlBLENBQUNVLFFBQVEsQ0FBQ1A7UUFDakMsSUFBSSxDQUFDTSxNQUFNLE9BQU9YLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7WUFBRUMsU0FBUztZQUFPQyxTQUFTO1FBQWlCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO1FBRWpHLE1BQU1HLGVBQWVGLEtBQUtHLEtBQUssQ0FBQ0MsUUFBUSxDQUFDVDtRQUN6QyxJQUFJTyxjQUFjO1lBQ2hCRixLQUFLRyxLQUFLLEdBQUdILEtBQUtHLEtBQUssQ0FBQ0UsTUFBTSxDQUFDLENBQUNDLEtBQWVBLE9BQU9YO1FBQ3hELE9BQU87WUFDTEssS0FBS0csS0FBSyxDQUFDSSxJQUFJLENBQUNaO1FBQ2xCO1FBQ0EsTUFBTUssS0FBS1EsSUFBSTtRQUVmLE9BQU9uQixxREFBWUEsQ0FBQ08sSUFBSSxDQUFDO1lBQUVDLFNBQVM7WUFBTVksT0FBTyxDQUFDUDtZQUFjUSxZQUFZVixLQUFLRyxLQUFLLENBQUNRLE1BQU07UUFBQztJQUNoRyxFQUFFLE9BQU07UUFDTixPQUFPdEIscURBQVlBLENBQUNPLElBQUksQ0FBQztZQUFFQyxTQUFTO1lBQU9DLFNBQVM7UUFBZSxHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUN0RjtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXE1yIEFyeWFcXERvd25sb2Fkc1xccHVibGljLXNwYWNlLXZlcmNlbCAoMSlcXHB1YmxpYy1zcGFjZS1kZXBsb3lcXGFwcFxcYXBpXFxwb3N0c1xcbGlrZVxccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgY29ubmVjdERCIH0gZnJvbSBcIkAvbGliL21vbmdvZGJcIjtcbmltcG9ydCBQb3N0IGZyb20gXCJAL21vZGVscy9Qb3N0XCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBjb25uZWN0REIoKTtcbiAgICBjb25zdCB7IHBvc3RJZCwgdXNlcklkIH0gPSBhd2FpdCByZXEuanNvbigpO1xuICAgIGlmICghcG9zdElkIHx8ICF1c2VySWQpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiBcInBvc3RJZCBhbmQgdXNlcklkIHJlcXVpcmVkXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcblxuICAgIGNvbnN0IHBvc3QgPSBhd2FpdCBQb3N0LmZpbmRCeUlkKHBvc3RJZCk7XG4gICAgaWYgKCFwb3N0KSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogXCJQb3N0IG5vdCBmb3VuZFwiIH0sIHsgc3RhdHVzOiA0MDQgfSk7XG5cbiAgICBjb25zdCBhbHJlYWR5TGlrZWQgPSBwb3N0Lmxpa2VzLmluY2x1ZGVzKHVzZXJJZCk7XG4gICAgaWYgKGFscmVhZHlMaWtlZCkge1xuICAgICAgcG9zdC5saWtlcyA9IHBvc3QubGlrZXMuZmlsdGVyKChpZDogc3RyaW5nKSA9PiBpZCAhPT0gdXNlcklkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zdC5saWtlcy5wdXNoKHVzZXJJZCk7XG4gICAgfVxuICAgIGF3YWl0IHBvc3Quc2F2ZSgpO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgbGlrZWQ6ICFhbHJlYWR5TGlrZWQsIGxpa2VzQ291bnQ6IHBvc3QubGlrZXMubGVuZ3RoIH0pO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogXCJTZXJ2ZXIgZXJyb3JcIiB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiY29ubmVjdERCIiwiUG9zdCIsIlBPU1QiLCJyZXEiLCJwb3N0SWQiLCJ1c2VySWQiLCJqc29uIiwic3VjY2VzcyIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJwb3N0IiwiZmluZEJ5SWQiLCJhbHJlYWR5TGlrZWQiLCJsaWtlcyIsImluY2x1ZGVzIiwiZmlsdGVyIiwiaWQiLCJwdXNoIiwic2F2ZSIsImxpa2VkIiwibGlrZXNDb3VudCIsImxlbmd0aCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/posts/like/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/mongodb.ts":
/*!************************!*\
  !*** ./lib/mongodb.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectDB: () => (/* binding */ connectDB)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst MONGODB_URI = process.env.MONGODB_URI ?? \"\";\nif (!MONGODB_URI) {\n    throw new Error(\"Please define MONGODB_URI in .env.local\");\n}\nconst cached = global.mongooseCache ?? {\n    conn: null,\n    promise: null\n};\nglobal.mongooseCache = cached;\nasync function connectDB() {\n    if (cached.conn) return cached.conn;\n    if (!cached.promise) {\n        cached.promise = mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, {\n            bufferCommands: false\n        });\n    }\n    cached.conn = await cached.promise;\n    return cached.conn;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbW9uZ29kYi50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBZ0M7QUFFaEMsTUFBTUMsY0FBY0MsUUFBUUMsR0FBRyxDQUFDRixXQUFXLElBQUk7QUFFL0MsSUFBSSxDQUFDQSxhQUFhO0lBQ2hCLE1BQU0sSUFBSUcsTUFBTTtBQUNsQjtBQVlBLE1BQU1DLFNBQXdCQyxPQUFPQyxhQUFhLElBQUk7SUFBRUMsTUFBTTtJQUFNQyxTQUFTO0FBQUs7QUFDbEZILE9BQU9DLGFBQWEsR0FBR0Y7QUFFaEIsZUFBZUs7SUFDcEIsSUFBSUwsT0FBT0csSUFBSSxFQUFFLE9BQU9ILE9BQU9HLElBQUk7SUFFbkMsSUFBSSxDQUFDSCxPQUFPSSxPQUFPLEVBQUU7UUFDbkJKLE9BQU9JLE9BQU8sR0FBR1QsdURBQWdCLENBQUNDLGFBQWE7WUFDN0NXLGdCQUFnQjtRQUNsQjtJQUNGO0lBRUFQLE9BQU9HLElBQUksR0FBRyxNQUFNSCxPQUFPSSxPQUFPO0lBQ2xDLE9BQU9KLE9BQU9HLElBQUk7QUFDcEIiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcTXIgQXJ5YVxcRG93bmxvYWRzXFxwdWJsaWMtc3BhY2UtdmVyY2VsICgxKVxccHVibGljLXNwYWNlLWRlcGxveVxcbGliXFxtb25nb2RiLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcblxuY29uc3QgTU9OR09EQl9VUkkgPSBwcm9jZXNzLmVudi5NT05HT0RCX1VSSSA/PyBcIlwiO1xuXG5pZiAoIU1PTkdPREJfVVJJKSB7XG4gIHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBkZWZpbmUgTU9OR09EQl9VUkkgaW4gLmVudi5sb2NhbFwiKTtcbn1cblxuaW50ZXJmYWNlIE1vbmdvb3NlQ2FjaGUge1xuICBjb25uOiB0eXBlb2YgbW9uZ29vc2UgfCBudWxsO1xuICBwcm9taXNlOiBQcm9taXNlPHR5cGVvZiBtb25nb29zZT4gfCBudWxsO1xufVxuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby12YXJcbiAgdmFyIG1vbmdvb3NlQ2FjaGU6IE1vbmdvb3NlQ2FjaGUgfCB1bmRlZmluZWQ7XG59XG5cbmNvbnN0IGNhY2hlZDogTW9uZ29vc2VDYWNoZSA9IGdsb2JhbC5tb25nb29zZUNhY2hlID8/IHsgY29ubjogbnVsbCwgcHJvbWlzZTogbnVsbCB9O1xuZ2xvYmFsLm1vbmdvb3NlQ2FjaGUgPSBjYWNoZWQ7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25uZWN0REIoKTogUHJvbWlzZTx0eXBlb2YgbW9uZ29vc2U+IHtcbiAgaWYgKGNhY2hlZC5jb25uKSByZXR1cm4gY2FjaGVkLmNvbm47XG5cbiAgaWYgKCFjYWNoZWQucHJvbWlzZSkge1xuICAgIGNhY2hlZC5wcm9taXNlID0gbW9uZ29vc2UuY29ubmVjdChNT05HT0RCX1VSSSwge1xuICAgICAgYnVmZmVyQ29tbWFuZHM6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgY2FjaGVkLmNvbm4gPSBhd2FpdCBjYWNoZWQucHJvbWlzZTtcbiAgcmV0dXJuIGNhY2hlZC5jb25uO1xufVxuIl0sIm5hbWVzIjpbIm1vbmdvb3NlIiwiTU9OR09EQl9VUkkiLCJwcm9jZXNzIiwiZW52IiwiRXJyb3IiLCJjYWNoZWQiLCJnbG9iYWwiLCJtb25nb29zZUNhY2hlIiwiY29ubiIsInByb21pc2UiLCJjb25uZWN0REIiLCJjb25uZWN0IiwiYnVmZmVyQ29tbWFuZHMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/mongodb.ts\n");

/***/ }),

/***/ "(rsc)/./models/Post.ts":
/*!************************!*\
  !*** ./models/Post.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst CommentSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    userId: String,\n    userName: String,\n    userAvatar: String,\n    text: String,\n    createdAt: {\n        type: Date,\n        default: Date.now\n    }\n});\nconst PostSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    userId: {\n        type: String,\n        required: true\n    },\n    userName: {\n        type: String,\n        required: true\n    },\n    userAvatar: {\n        type: String,\n        default: \"\"\n    },\n    caption: {\n        type: String,\n        default: \"\"\n    },\n    mediaUrl: {\n        type: String,\n        required: true\n    },\n    mediaType: {\n        type: String,\n        enum: [\n            \"image\",\n            \"video\"\n        ],\n        default: \"image\"\n    },\n    publicId: {\n        type: String,\n        default: \"\"\n    },\n    likes: [\n        {\n            type: String\n        }\n    ],\n    comments: [\n        CommentSchema\n    ],\n    shares: {\n        type: Number,\n        default: 0\n    }\n}, {\n    timestamps: true\n});\nconst Post = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().models).Post ?? mongoose__WEBPACK_IMPORTED_MODULE_0___default().model(\"Post\", PostSchema);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Post);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9tb2RlbHMvUG9zdC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBNkQ7QUF5QjdELE1BQU1FLGdCQUFnQixJQUFJRCw0Q0FBTUEsQ0FBVztJQUN6Q0UsUUFBUUM7SUFDUkMsVUFBVUQ7SUFDVkUsWUFBWUY7SUFDWkcsTUFBTUg7SUFDTkksV0FBVztRQUFFQyxNQUFNQztRQUFNQyxTQUFTRCxLQUFLRSxHQUFHO0lBQUM7QUFDN0M7QUFFQSxNQUFNQyxhQUFhLElBQUlaLDRDQUFNQSxDQUMzQjtJQUNFRSxRQUFRO1FBQUVNLE1BQU1MO1FBQVFVLFVBQVU7SUFBSztJQUN2Q1QsVUFBVTtRQUFFSSxNQUFNTDtRQUFRVSxVQUFVO0lBQUs7SUFDekNSLFlBQVk7UUFBRUcsTUFBTUw7UUFBUU8sU0FBUztJQUFHO0lBQ3hDSSxTQUFTO1FBQUVOLE1BQU1MO1FBQVFPLFNBQVM7SUFBRztJQUNyQ0ssVUFBVTtRQUFFUCxNQUFNTDtRQUFRVSxVQUFVO0lBQUs7SUFDekNHLFdBQVc7UUFBRVIsTUFBTUw7UUFBUWMsTUFBTTtZQUFDO1lBQVM7U0FBUTtRQUFFUCxTQUFTO0lBQVE7SUFDdEVRLFVBQVU7UUFBRVYsTUFBTUw7UUFBUU8sU0FBUztJQUFHO0lBQ3RDUyxPQUFPO1FBQUM7WUFBRVgsTUFBTUw7UUFBTztLQUFFO0lBQ3pCaUIsVUFBVTtRQUFDbkI7S0FBYztJQUN6Qm9CLFFBQVE7UUFBRWIsTUFBTWM7UUFBUVosU0FBUztJQUFFO0FBQ3JDLEdBQ0E7SUFBRWEsWUFBWTtBQUFLO0FBR3JCLE1BQU1DLE9BQXFCekIsd0RBQWUsQ0FBQ3lCLElBQUksSUFBSXpCLHFEQUFjLENBQVEsUUFBUWE7QUFDakYsaUVBQWVZLElBQUlBLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcTXIgQXJ5YVxcRG93bmxvYWRzXFxwdWJsaWMtc3BhY2UtdmVyY2VsICgxKVxccHVibGljLXNwYWNlLWRlcGxveVxcbW9kZWxzXFxQb3N0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSwgeyBTY2hlbWEsIERvY3VtZW50LCBNb2RlbCB9IGZyb20gXCJtb25nb29zZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDb21tZW50IHtcbiAgdXNlcklkOiBzdHJpbmc7XG4gIHVzZXJOYW1lOiBzdHJpbmc7XG4gIHVzZXJBdmF0YXI6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICBjcmVhdGVkQXQ6IERhdGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBvc3QgZXh0ZW5kcyBEb2N1bWVudCB7XG4gIF9pZDogc3RyaW5nO1xuICB1c2VySWQ6IHN0cmluZztcbiAgdXNlck5hbWU6IHN0cmluZztcbiAgdXNlckF2YXRhcjogc3RyaW5nO1xuICBjYXB0aW9uOiBzdHJpbmc7XG4gIG1lZGlhVXJsOiBzdHJpbmc7XG4gIG1lZGlhVHlwZTogXCJpbWFnZVwiIHwgXCJ2aWRlb1wiO1xuICBwdWJsaWNJZDogc3RyaW5nO1xuICBsaWtlczogc3RyaW5nW107IC8vIHVzZXIgSURzIHdobyBsaWtlZFxuICBjb21tZW50czogSUNvbW1lbnRbXTtcbiAgc2hhcmVzOiBudW1iZXI7XG4gIGNyZWF0ZWRBdDogRGF0ZTtcbn1cblxuY29uc3QgQ29tbWVudFNjaGVtYSA9IG5ldyBTY2hlbWE8SUNvbW1lbnQ+KHtcbiAgdXNlcklkOiBTdHJpbmcsXG4gIHVzZXJOYW1lOiBTdHJpbmcsXG4gIHVzZXJBdmF0YXI6IFN0cmluZyxcbiAgdGV4dDogU3RyaW5nLFxuICBjcmVhdGVkQXQ6IHsgdHlwZTogRGF0ZSwgZGVmYXVsdDogRGF0ZS5ub3cgfSxcbn0pO1xuXG5jb25zdCBQb3N0U2NoZW1hID0gbmV3IFNjaGVtYTxJUG9zdD4oXG4gIHtcbiAgICB1c2VySWQ6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgIHVzZXJOYW1lOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICB1c2VyQXZhdGFyOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogXCJcIiB9LFxuICAgIGNhcHRpb246IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiBcIlwiIH0sXG4gICAgbWVkaWFVcmw6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgIG1lZGlhVHlwZTogeyB0eXBlOiBTdHJpbmcsIGVudW06IFtcImltYWdlXCIsIFwidmlkZW9cIl0sIGRlZmF1bHQ6IFwiaW1hZ2VcIiB9LFxuICAgIHB1YmxpY0lkOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogXCJcIiB9LFxuICAgIGxpa2VzOiBbeyB0eXBlOiBTdHJpbmcgfV0sXG4gICAgY29tbWVudHM6IFtDb21tZW50U2NoZW1hXSxcbiAgICBzaGFyZXM6IHsgdHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwIH0sXG4gIH0sXG4gIHsgdGltZXN0YW1wczogdHJ1ZSB9XG4pO1xuXG5jb25zdCBQb3N0OiBNb2RlbDxJUG9zdD4gPSBtb25nb29zZS5tb2RlbHMuUG9zdCA/PyBtb25nb29zZS5tb2RlbDxJUG9zdD4oXCJQb3N0XCIsIFBvc3RTY2hlbWEpO1xuZXhwb3J0IGRlZmF1bHQgUG9zdDtcbiJdLCJuYW1lcyI6WyJtb25nb29zZSIsIlNjaGVtYSIsIkNvbW1lbnRTY2hlbWEiLCJ1c2VySWQiLCJTdHJpbmciLCJ1c2VyTmFtZSIsInVzZXJBdmF0YXIiLCJ0ZXh0IiwiY3JlYXRlZEF0IiwidHlwZSIsIkRhdGUiLCJkZWZhdWx0Iiwibm93IiwiUG9zdFNjaGVtYSIsInJlcXVpcmVkIiwiY2FwdGlvbiIsIm1lZGlhVXJsIiwibWVkaWFUeXBlIiwiZW51bSIsInB1YmxpY0lkIiwibGlrZXMiLCJjb21tZW50cyIsInNoYXJlcyIsIk51bWJlciIsInRpbWVzdGFtcHMiLCJQb3N0IiwibW9kZWxzIiwibW9kZWwiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./models/Post.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fposts%2Flike%2Froute&page=%2Fapi%2Fposts%2Flike%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fposts%2Flike%2Froute.ts&appDir=C%3A%5CUsers%5CMr%20Arya%5CDownloads%5Cpublic-space-vercel%20(1)%5Cpublic-space-deploy%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CMr%20Arya%5CDownloads%5Cpublic-space-vercel%20(1)%5Cpublic-space-deploy&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fposts%2Flike%2Froute&page=%2Fapi%2Fposts%2Flike%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fposts%2Flike%2Froute.ts&appDir=C%3A%5CUsers%5CMr%20Arya%5CDownloads%5Cpublic-space-vercel%20(1)%5Cpublic-space-deploy%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CMr%20Arya%5CDownloads%5Cpublic-space-vercel%20(1)%5Cpublic-space-deploy&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_Mr_Arya_Downloads_public_space_vercel_1_public_space_deploy_app_api_posts_like_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/posts/like/route.ts */ \"(rsc)/./app/api/posts/like/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/posts/like/route\",\n        pathname: \"/api/posts/like\",\n        filename: \"route\",\n        bundlePath: \"app/api/posts/like/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Mr Arya\\\\Downloads\\\\public-space-vercel (1)\\\\public-space-deploy\\\\app\\\\api\\\\posts\\\\like\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_Mr_Arya_Downloads_public_space_vercel_1_public_space_deploy_app_api_posts_like_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZwb3N0cyUyRmxpa2UlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnBvc3RzJTJGbGlrZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnBvc3RzJTJGbGlrZSUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNNciUyMEFyeWElNUNEb3dubG9hZHMlNUNwdWJsaWMtc3BhY2UtdmVyY2VsJTIwKDEpJTVDcHVibGljLXNwYWNlLWRlcGxveSU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDTXIlMjBBcnlhJTVDRG93bmxvYWRzJTVDcHVibGljLXNwYWNlLXZlcmNlbCUyMCgxKSU1Q3B1YmxpYy1zcGFjZS1kZXBsb3kmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQzREO0FBQ3pJO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxNciBBcnlhXFxcXERvd25sb2Fkc1xcXFxwdWJsaWMtc3BhY2UtdmVyY2VsICgxKVxcXFxwdWJsaWMtc3BhY2UtZGVwbG95XFxcXGFwcFxcXFxhcGlcXFxccG9zdHNcXFxcbGlrZVxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvcG9zdHMvbGlrZS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3Bvc3RzL2xpa2VcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3Bvc3RzL2xpa2Uvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFxVc2Vyc1xcXFxNciBBcnlhXFxcXERvd25sb2Fkc1xcXFxwdWJsaWMtc3BhY2UtdmVyY2VsICgxKVxcXFxwdWJsaWMtc3BhY2UtZGVwbG95XFxcXGFwcFxcXFxhcGlcXFxccG9zdHNcXFxcbGlrZVxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fposts%2Flike%2Froute&page=%2Fapi%2Fposts%2Flike%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fposts%2Flike%2Froute.ts&appDir=C%3A%5CUsers%5CMr%20Arya%5CDownloads%5Cpublic-space-vercel%20(1)%5Cpublic-space-deploy%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CMr%20Arya%5CDownloads%5Cpublic-space-vercel%20(1)%5Cpublic-space-deploy&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fposts%2Flike%2Froute&page=%2Fapi%2Fposts%2Flike%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fposts%2Flike%2Froute.ts&appDir=C%3A%5CUsers%5CMr%20Arya%5CDownloads%5Cpublic-space-vercel%20(1)%5Cpublic-space-deploy%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CMr%20Arya%5CDownloads%5Cpublic-space-vercel%20(1)%5Cpublic-space-deploy&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();