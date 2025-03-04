export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["avatars/01.png","avatars/02.png","avatars/03.png","avatars/04.png","avatars/05.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.DqYQoMTq.js",app:"_app/immutable/entry/app.BrS5IKO1.js",imports:["_app/immutable/entry/start.DqYQoMTq.js","_app/immutable/chunks/Dq5e3RKE.js","_app/immutable/chunks/cEpLIoOg.js","_app/immutable/chunks/aB5qoYrk.js","_app/immutable/entry/app.BrS5IKO1.js","_app/immutable/chunks/cEpLIoOg.js","_app/immutable/chunks/2f1_EdUI.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
