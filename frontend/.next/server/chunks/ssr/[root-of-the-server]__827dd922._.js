module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/assert [external] (assert, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}}),
"[externals]/tty [external] (tty, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[project]/src/lib/services/auth.service.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "authService": (()=>authService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:5001/api") || 'http://localhost:5001/api';
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Add token to requests if available
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
const authService = {
    async login (credentials) {
        console.log('🌐 AuthService: Making API call to:', `${API_URL}/auth/login`);
        console.log('📧 AuthService: Sending credentials:', {
            email: credentials.email,
            password: '***'
        });
        try {
            const response = await api.post('/auth/login', credentials);
            console.log('📡 AuthService: API response received:', response.data);
            console.log('✅ AuthService: Response status:', response.status);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                console.log('💾 AuthService: Token saved to localStorage');
                // Also set token in cookies for middleware
                document.cookie = `token=${response.data.token}; path=/; max-age=${24 * 60 * 60}`; // 24 hours
                console.log('🍪 AuthService: Token saved to cookies');
            }
            return response.data;
        } catch (error) {
            console.error('🚨 AuthService: API call failed:', error);
            console.error('📄 Error response data:', error.response?.data);
            console.error('🔢 Error status:', error.response?.status);
            console.error('🔗 Error config:', error.config);
            console.error('💥 Full error object:', error);
            // Re-throw with more specific error information
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            const errorStatus = error.response?.status || 'Unknown';
            console.error('🎯 Throwing error with message:', errorMessage, 'status:', errorStatus);
            throw new Error(`${errorMessage} (Status: ${errorStatus})`);
        }
    },
    async register (userData) {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Also set token in cookies for middleware
            document.cookie = `token=${response.data.token}; path=/; max-age=${24 * 60 * 60}`; // 24 hours
        }
        return response.data;
    },
    async getProfile () {
        const response = await api.get('/auth/profile');
        return response.data;
    },
    logout () {
        localStorage.removeItem('token');
        // Also remove token from cookies
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },
    getToken () {
        return localStorage.getItem('token');
    }
};
}}),
"[project]/src/lib/features/auth/authSlice.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "clearError": (()=>clearError),
    "default": (()=>__TURBOPACK__default__export__),
    "fetchUserProfile": (()=>fetchUserProfile),
    "initializeAuth": (()=>initializeAuth),
    "loginUser": (()=>loginUser),
    "logout": (()=>logout),
    "registerUser": (()=>registerUser),
    "setCredentials": (()=>setCredentials)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/auth.service.ts [app-ssr] (ecmascript)");
;
;
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
};
const loginUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('auth/login', async (credentials)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].login(credentials);
    return response;
});
const registerUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('auth/register', async (userData)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].register(userData);
    return response;
});
const fetchUserProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('auth/fetchProfile', async ()=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].getProfile();
    return response;
});
const authSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state)=>{
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].logout();
        },
        clearError: (state)=>{
            state.error = null;
        },
        setCredentials: (state, action)=>{
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
        },
        initializeAuth: (state, action)=>{
            console.log('🔧 Redux: initializeAuth called with token:', action.payload.token ? 'YES' : 'NO');
            if (action.payload.token) {
                state.token = action.payload.token;
                state.isAuthenticated = true;
                console.log('✅ Redux: Auth initialized with token');
            } else {
                console.log('❌ Redux: No token found, user not authenticated');
            }
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(loginUser.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(loginUser.fulfilled, (state, action)=>{
            console.log('🔄 Redux: loginUser.fulfilled action received:', action.payload);
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
            console.log('✅ Redux: Auth state updated - isAuthenticated:', true);
        }).addCase(loginUser.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message || 'Login failed';
        }).addCase(registerUser.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(registerUser.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
        }).addCase(registerUser.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message || 'Registration failed';
        }).addCase(fetchUserProfile.fulfilled, (state, action)=>{
            console.log('👤 Redux: fetchUserProfile.fulfilled, user data:', action.payload);
            state.user = action.payload.user;
            state.isAuthenticated = true;
        }).addCase(fetchUserProfile.rejected, (state)=>{
            // If fetching profile fails, clear authentication
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].logout();
        });
    }
});
const { logout, clearError, setCredentials, initializeAuth } = authSlice.actions;
const __TURBOPACK__default__export__ = authSlice.reducer;
}}),
"[project]/src/lib/features/tasks/taskSlice.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "clearError": (()=>clearError),
    "createTask": (()=>createTask),
    "default": (()=>__TURBOPACK__default__export__),
    "deleteTask": (()=>deleteTask),
    "fetchTaskStats": (()=>fetchTaskStats),
    "fetchTasks": (()=>fetchTasks),
    "setFilters": (()=>setFilters),
    "setPage": (()=>setPage),
    "updateTask": (()=>updateTask)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:5001/api") || 'http://localhost:5001/api';
// Create axios instance
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_URL
});
// Add token to requests
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
const initialState = {
    tasks: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
    filters: {}
};
const fetchTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('tasks/fetchTasks', async (params = {})=>{
    const { page = 1, limit = 10, filters = {} } = params;
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
    });
    const response = await api.get(`/tasks?${queryParams}`);
    return response.data;
});
const createTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('tasks/createTask', async (taskData)=>{
    const response = await api.post('/tasks', taskData);
    return response.data;
});
const updateTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('tasks/updateTask', async ({ id, updates })=>{
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
});
const deleteTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('tasks/deleteTask', async (id)=>{
    await api.delete(`/tasks/${id}`);
    return id;
});
const fetchTaskStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('tasks/fetchTaskStats', async (userId)=>{
    const queryParams = userId ? `?userId=${userId}` : '';
    const response = await api.get(`/tasks/stats${queryParams}`);
    return response.data;
});
const taskSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'tasks',
    initialState,
    reducers: {
        setFilters: (state, action)=>{
            state.filters = action.payload;
            state.page = 1; // Reset to first page when filters change
        },
        setPage: (state, action)=>{
            state.page = action.payload;
        },
        clearError: (state)=>{
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder// Fetch tasks
        .addCase(fetchTasks.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(fetchTasks.fulfilled, (state, action)=>{
            state.loading = false;
            state.tasks = action.payload.data;
            state.total = action.payload.pagination.total;
            state.page = action.payload.pagination.page;
        }).addCase(fetchTasks.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch tasks';
        })// Create task
        .addCase(createTask.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(createTask.fulfilled, (state, action)=>{
            state.loading = false;
            state.tasks.unshift(action.payload.data); // Add to beginning
            state.total += 1;
        }).addCase(createTask.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message || 'Failed to create task';
        })// Update task
        .addCase(updateTask.fulfilled, (state, action)=>{
            const index = state.tasks.findIndex((task)=>task.id === action.payload.data.id);
            if (index !== -1) {
                state.tasks[index] = action.payload.data;
            }
        }).addCase(updateTask.rejected, (state, action)=>{
            state.error = action.error.message || 'Failed to update task';
        })// Delete task
        .addCase(deleteTask.fulfilled, (state, action)=>{
            state.tasks = state.tasks.filter((task)=>task.id !== action.payload);
            state.total -= 1;
        }).addCase(deleteTask.rejected, (state, action)=>{
            state.error = action.error.message || 'Failed to delete task';
        });
    }
});
const { setFilters, setPage, clearError } = taskSlice.actions;
const __TURBOPACK__default__export__ = taskSlice.reducer;
}}),
"[project]/src/lib/features/team/teamSlice.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "clearError": (()=>clearError),
    "clearStats": (()=>clearStats),
    "createTeamMember": (()=>createTeamMember),
    "default": (()=>__TURBOPACK__default__export__),
    "deleteTeamMember": (()=>deleteTeamMember),
    "fetchTeamMemberById": (()=>fetchTeamMemberById),
    "fetchTeamMembers": (()=>fetchTeamMembers),
    "fetchTeamMembersByDepartment": (()=>fetchTeamMembersByDepartment),
    "fetchTeamStats": (()=>fetchTeamStats),
    "setFilters": (()=>setFilters),
    "setLimit": (()=>setLimit),
    "setPage": (()=>setPage),
    "updateTeamMember": (()=>updateTeamMember)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:5001/api") || 'http://localhost:5001';
const initialState = {
    members: [],
    stats: null,
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
    filters: {}
};
// Helper function to get auth header
const getAuthHeader = ()=>{
    const token = localStorage.getItem('token');
    return token ? {
        Authorization: `Bearer ${token}`
    } : {};
};
const fetchTeamMembers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('team/fetchTeamMembers', async (params = {})=>{
    const { page = 1, limit = 10, filters = {} } = params;
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([, value])=>value !== undefined && value !== ''))
    });
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/api/team?${queryParams}`, {
        headers: getAuthHeader()
    });
    return response.data;
});
const fetchTeamMemberById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('team/fetchTeamMemberById', async (id)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/api/team/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
});
const createTeamMember = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('team/createTeamMember', async (memberData)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE_URL}/api/team`, memberData, {
        headers: getAuthHeader()
    });
    return response.data;
});
const updateTeamMember = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('team/updateTeamMember', async ({ id, updates })=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`${API_BASE_URL}/api/team/${id}`, updates, {
        headers: getAuthHeader()
    });
    return response.data;
});
const deleteTeamMember = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('team/deleteTeamMember', async (id)=>{
    await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].delete(`${API_BASE_URL}/api/team/${id}`, {
        headers: getAuthHeader()
    });
    return id;
});
const fetchTeamStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('team/fetchTeamStats', async ()=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/api/team/stats`, {
        headers: getAuthHeader()
    });
    return response.data;
});
const fetchTeamMembersByDepartment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('team/fetchTeamMembersByDepartment', async (department)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/api/team/department/${department}`, {
        headers: getAuthHeader()
    });
    return response.data;
});
// Slice
const teamSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'team',
    initialState,
    reducers: {
        setPage: (state, action)=>{
            state.page = action.payload;
        },
        setLimit: (state, action)=>{
            state.limit = action.payload;
        },
        setFilters: (state, action)=>{
            state.filters = action.payload;
            state.page = 1; // Reset to first page when filters change
        },
        clearError: (state)=>{
            state.error = null;
        },
        clearStats: (state)=>{
            state.stats = null;
        }
    },
    extraReducers: (builder)=>{
        builder// Fetch team members
        .addCase(fetchTeamMembers.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(fetchTeamMembers.fulfilled, (state, action)=>{
            state.loading = false;
            state.members = action.payload.data;
            state.total = action.payload.pagination.total;
            state.page = action.payload.pagination.page;
            state.limit = action.payload.pagination.limit;
        }).addCase(fetchTeamMembers.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch team members';
        })// Fetch team member by ID
        .addCase(fetchTeamMemberById.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(fetchTeamMemberById.fulfilled, (state, action)=>{
            state.loading = false;
            // Update the member in the list if it exists
            const index = state.members.findIndex((member)=>member.id === action.payload.data.id);
            if (index !== -1) {
                state.members[index] = action.payload.data;
            }
        }).addCase(fetchTeamMemberById.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch team member';
        })// Create team member
        .addCase(createTeamMember.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(createTeamMember.fulfilled, (state, action)=>{
            state.loading = false;
            state.members.unshift(action.payload.data);
            state.total += 1;
        }).addCase(createTeamMember.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message || 'Failed to create team member';
        })// Update team member
        .addCase(updateTeamMember.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(updateTeamMember.fulfilled, (state, action)=>{
            state.loading = false;
            const index = state.members.findIndex((member)=>member.id === action.payload.data.id);
            if (index !== -1) {
                state.members[index] = action.payload.data;
            }
        }).addCase(updateTeamMember.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message || 'Failed to update team member';
        })// Delete team member
        .addCase(deleteTeamMember.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(deleteTeamMember.fulfilled, (state, action)=>{
            state.loading = false;
            state.members = state.members.filter((member)=>member.id !== action.payload);
            state.total -= 1;
        }).addCase(deleteTeamMember.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message || 'Failed to delete team member';
        })// Fetch team stats
        .addCase(fetchTeamStats.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(fetchTeamStats.fulfilled, (state, action)=>{
            state.loading = false;
            state.stats = action.payload.data;
        }).addCase(fetchTeamStats.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch team statistics';
        })// Fetch team members by department
        .addCase(fetchTeamMembersByDepartment.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(fetchTeamMembersByDepartment.fulfilled, (state)=>{
            state.loading = false;
        // This doesn't update the main members list, just returns data for specific use cases
        }).addCase(fetchTeamMembersByDepartment.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch team members by department';
        });
    }
});
const { setPage, setLimit, setFilters, clearError, clearStats } = teamSlice.actions;
const __TURBOPACK__default__export__ = teamSlice.reducer;
}}),
"[project]/src/lib/store.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "makeStore": (()=>makeStore)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/features/auth/authSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$tasks$2f$taskSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/features/tasks/taskSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$team$2f$teamSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/features/team/teamSlice.ts [app-ssr] (ecmascript)");
;
;
;
;
const makeStore = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
        reducer: {
            auth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
            tasks: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$tasks$2f$taskSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
            team: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$team$2f$teamSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
        }
    });
};
}}),
"[project]/src/providers/StoreProvider.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "StoreProvider": (()=>StoreProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function StoreProvider({ children }) {
    const storeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    if (!storeRef.current) {
        storeRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeStore"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"], {
        store: storeRef.current,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/providers/StoreProvider.tsx",
        lineNumber: 13,
        columnNumber: 10
    }, this);
}
}}),
"[project]/src/lib/emotion-cache.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>createEmotionCache)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$cache$2f$dist$2f$emotion$2d$cache$2e$development$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@emotion/cache/dist/emotion-cache.development.esm.js [app-ssr] (ecmascript)");
;
const isBrowser = typeof document !== 'undefined';
function createEmotionCache() {
    let insertionPoint;
    if (isBrowser) {
        const emotionInsertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');
        insertionPoint = emotionInsertionPoint ?? undefined;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$cache$2f$dist$2f$emotion$2d$cache$2e$development$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
        key: 'mui-style',
        insertionPoint
    });
}
}}),
"[project]/src/providers/ThemeProvider.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ThemeProvider": (()=>ThemeProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/ThemeProvider.js [app-ssr] (ecmascript) <export default as ThemeProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/createTheme.js [app-ssr] (ecmascript) <export default as createTheme>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CssBaseline$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/CssBaseline/CssBaseline.js [app-ssr] (ecmascript) <export default as CssBaseline>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$dist$2f$emotion$2d$element$2d$782f682d$2e$development$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__C__as__CacheProvider$3e$__ = __turbopack_context__.i("[project]/node_modules/@emotion/react/dist/emotion-element-782f682d.development.esm.js [app-ssr] (ecmascript) <export C as CacheProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$emotion$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/emotion-cache.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__["createTheme"])({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2'
        },
        secondary: {
            main: '#dc004e'
        }
    }
});
// Client-side cache, created on client side only
const clientSideEmotionCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$emotion$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])();
function ThemeProvider({ children }) {
    const [emotionCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(clientSideEmotionCache);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$dist$2f$emotion$2d$element$2d$782f682d$2e$development$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__C__as__CacheProvider$3e$__["CacheProvider"], {
        value: emotionCache,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__["ThemeProvider"], {
            theme: theme,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CssBaseline$3e$__["CssBaseline"], {}, void 0, false, {
                    fileName: "[project]/src/providers/ThemeProvider.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/src/providers/ThemeProvider.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/providers/ThemeProvider.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/lib/hooks.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "useAppDispatch": (()=>useAppDispatch),
    "useAppSelector": (()=>useAppSelector)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
;
const useAppDispatch = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDispatch"])();
const useAppSelector = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSelector"];
}}),
"[project]/src/components/AuthInitializer.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthInitializer": (()=>AuthInitializer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/hooks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/features/auth/authSlice.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function AuthInitializer() {
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Only run on client side to avoid hydration mismatch
        console.log('🔧 AuthInitializer: Checking localStorage for token...');
        const token = localStorage.getItem('token');
        console.log('🎟️ Found token:', token ? 'YES' : 'NO');
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeAuth"])({
            token
        }));
        console.log('✅ AuthInitializer: Dispatched initializeAuth');
        // If we have a token, fetch the user profile
        if (token) {
            console.log('👤 AuthInitializer: Fetching user profile...');
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchUserProfile"])());
        }
    }, [
        dispatch
    ]);
    return null; // This component doesn't render anything
}
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__827dd922._.js.map