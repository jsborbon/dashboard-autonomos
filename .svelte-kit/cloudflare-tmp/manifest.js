export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["avatar.png","favicon.ico","logo.jpeg"]),
	mimeTypes: {".png":"image/png",".jpeg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.sLzMN3s9.js",app:"_app/immutable/entry/app.D3GDBN9R.js",imports:["_app/immutable/entry/start.sLzMN3s9.js","_app/immutable/chunks/CRkw0ab8.js","_app/immutable/chunks/Puzv3N_n.js","_app/immutable/chunks/DQqNwFm1.js","_app/immutable/entry/app.D3GDBN9R.js","_app/immutable/chunks/Puzv3N_n.js","_app/immutable/chunks/CF8Np5xo.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
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

export const prerendered = new Set([]);

export const base_path = "";
