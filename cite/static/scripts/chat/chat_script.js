(() => {
  // ../constants.ts
  var PROTOCOL = "http://";
  var DOMEN = "localhost";
  var BASE_URL = PROTOCOL + DOMEN;
  var WS_URL = "ws://" + DOMEN;
  var AUTH_API_URL = BASE_URL + ":8081";
  var CHAT_URL = BASE_URL + ":3000/chat";
  var SIGN_IN_URL = BASE_URL + ":3000/sign_in";
  var CHAT_WS_URL = WS_URL + ":8080/api/chat_ws";

  // ui_objects/sidebar.ts
  var SidebarUI = class {
    constructor() {
      this.sidebarDiv = document.querySelector("#main_sidebar");
    }
    setupChats(chats_info) {
      chats_info.forEach((chat, index) => {
        this.addChat(chat);
      });
    }
    addChat(chat) {
      const chat_info_button = document.createElement("button");
      chat_info_button.id = `chat_${chat.id}_info`;
      chat_info_button.classList.add("chat__info");
      chat_info_button.classList.add("sidebar-element");
      const chat_avatar_div = document.createElement("div");
      const chat_avatar_img = document.createElement("img");
      chat_avatar_img.src = `/static/images/avatars/${chat.avatar}`;
      chat_avatar_div.append(chat_avatar_img);
      const chat_info_text = document.createElement("div");
      chat_info_text.classList.add("chat_info__text");
      const chat_info_name = document.createElement("div");
      chat_info_name.classList.add("chat__info-name");
      chat_info_name.classList.add("line-limit-length");
      chat_info_name.innerText = chat.name;
      chat_info_text.append(chat_info_name);
      chat_info_button.append(chat_info_text);
      this.sidebarDiv.prepend(chat_info_button);
    }
    show() {
    }
  };

  // objects/chat_info.ts
  var ChatsInfo = class {
  };

  // ../node_modules/websocket-ts/dist/esm/src/backoff/constantbackoff.js
  var ConstantBackoff = class {
    /**
     * Creates a new ConstantBackoff.
     * @param backoff the backoff-time to return
     */
    constructor(backoff) {
      this._retries = 0;
      if (!Number.isInteger(backoff) || backoff < 0) {
        throw new Error("Backoff must be a positive integer");
      }
      this.backoff = backoff;
    }
    get retries() {
      return this._retries;
    }
    get current() {
      return this.backoff;
    }
    next() {
      this._retries++;
      return this.backoff;
    }
    reset() {
      this._retries = 0;
    }
  };

  // ../node_modules/websocket-ts/dist/esm/src/queue/array_queue.js
  var ArrayQueue = class {
    constructor() {
      this.elements = [];
    }
    add(element) {
      this.elements.push(element);
    }
    clear() {
      this.elements.length = 0;
    }
    forEach(fn) {
      this.elements.forEach(fn);
    }
    length() {
      return this.elements.length;
    }
    isEmpty() {
      return this.elements.length === 0;
    }
    peek() {
      return this.elements[0];
    }
    read() {
      return this.elements.shift();
    }
  };

  // ../node_modules/websocket-ts/dist/esm/src/websocket_event.js
  var WebsocketEvent = {
    /** Fired when the connection is opened. */
    open: "open",
    /** Fired when the connection is closed. */
    close: "close",
    /** Fired when the connection has been closed because of an error, such as when some data couldn't be sent. */
    error: "error",
    /** Fired when a message is received. */
    message: "message",
    /** Fired when the websocket tries to reconnect after a connection loss. */
    retry: "retry",
    /** Fired when the websocket successfully reconnects after a connection loss. */
    reconnect: "reconnect"
  };

  // ../node_modules/websocket-ts/dist/esm/src/websocket.js
  var Websocket = class {
    /**
     * Creates a new websocket.
     *
     * @param url to connect to, or a function that returns a URL.
     * @param protocols optional protocols to use.
     * @param options optional options to use.
     */
    constructor(url, protocols, options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
      this._closedByUser = false;
      this.handleOpenEvent = (event) => this.handleEvent(WebsocketEvent.open, event);
      this.handleErrorEvent = (event) => this.handleEvent(WebsocketEvent.error, event);
      this.handleCloseEvent = (event) => this.handleEvent(WebsocketEvent.close, event);
      this.handleMessageEvent = (event) => this.handleEvent(WebsocketEvent.message, event);
      this._urlProvider = url;
      this._protocols = protocols;
      this._options = {
        buffer: options === null || options === void 0 ? void 0 : options.buffer,
        retry: {
          maxRetries: (_a = options === null || options === void 0 ? void 0 : options.retry) === null || _a === void 0 ? void 0 : _a.maxRetries,
          instantReconnect: (_b = options === null || options === void 0 ? void 0 : options.retry) === null || _b === void 0 ? void 0 : _b.instantReconnect,
          backoff: (_c = options === null || options === void 0 ? void 0 : options.retry) === null || _c === void 0 ? void 0 : _c.backoff
        },
        listeners: {
          open: [...(_e = (_d = options === null || options === void 0 ? void 0 : options.listeners) === null || _d === void 0 ? void 0 : _d.open) !== null && _e !== void 0 ? _e : []],
          close: [...(_g = (_f = options === null || options === void 0 ? void 0 : options.listeners) === null || _f === void 0 ? void 0 : _f.close) !== null && _g !== void 0 ? _g : []],
          error: [...(_j = (_h = options === null || options === void 0 ? void 0 : options.listeners) === null || _h === void 0 ? void 0 : _h.error) !== null && _j !== void 0 ? _j : []],
          message: [...(_l = (_k = options === null || options === void 0 ? void 0 : options.listeners) === null || _k === void 0 ? void 0 : _k.message) !== null && _l !== void 0 ? _l : []],
          retry: [...(_o = (_m = options === null || options === void 0 ? void 0 : options.listeners) === null || _m === void 0 ? void 0 : _m.retry) !== null && _o !== void 0 ? _o : []],
          reconnect: [...(_q = (_p = options === null || options === void 0 ? void 0 : options.listeners) === null || _p === void 0 ? void 0 : _p.reconnect) !== null && _q !== void 0 ? _q : []]
        }
      };
      this._underlyingWebsocket = this.tryConnect();
    }
    /**
     * Getter for the url.
     *
     * @return the url.
     */
    get url() {
      return this._url;
    }
    /**
     * Getter for the protocols.
     *
     * @return the protocols, or undefined if none were provided.
     */
    get protocols() {
      return this._protocols;
    }
    /**
     * Getter for the buffer.
     *
     * @return the buffer, or undefined if none was provided.
     */
    get buffer() {
      return this._options.buffer;
    }
    /**
     * Getter for the maxRetries.
     *
     * @return the maxRetries, or undefined if none was provided (no limit).
     */
    get maxRetries() {
      return this._options.retry.maxRetries;
    }
    /**
     * Getter for the instantReconnect.
     *
     * @return the instantReconnect, or undefined if none was provided.
     */
    get instantReconnect() {
      return this._options.retry.instantReconnect;
    }
    /**
     * Getter for the backoff.
     *
     * @return the backoff, or undefined if none was provided.
     */
    get backoff() {
      return this._options.retry.backoff;
    }
    /**
     * Whether the websocket was closed by the user. A websocket is closed by the user by calling close().
     *
     * @return true if the websocket was closed by the user, false otherwise.
     */
    get closedByUser() {
      return this._closedByUser;
    }
    /**
     * Getter for the last 'open' event, e.g. the last time the websocket was connected.
     *
     * @return the last 'open' event, or undefined if the websocket was never connected.
     */
    get lastConnection() {
      return this._lastConnection;
    }
    /**
     * Getter for the underlying websocket. This can be used to access the browser's native websocket directly.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
     * @return the underlying websocket.
     */
    get underlyingWebsocket() {
      return this._underlyingWebsocket;
    }
    /**
     * Getter for the readyState of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
     * @return the readyState of the underlying websocket.
     */
    get readyState() {
      return this._underlyingWebsocket.readyState;
    }
    /**
     * Getter for the bufferedAmount of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/bufferedAmount
     * @return the bufferedAmount of the underlying websocket.
     */
    get bufferedAmount() {
      return this._underlyingWebsocket.bufferedAmount;
    }
    /**
     * Getter for the extensions of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/extensions
     * @return the extensions of the underlying websocket.
     */
    get extensions() {
      return this._underlyingWebsocket.extensions;
    }
    /**
     * Getter for the binaryType of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/binaryType
     * @return the binaryType of the underlying websocket.
     */
    get binaryType() {
      return this._underlyingWebsocket.binaryType;
    }
    /**
     * Setter for the binaryType of the underlying websocket.
     *
     * @param value to set, 'blob' or 'arraybuffer'.
     */
    set binaryType(value) {
      this._underlyingWebsocket.binaryType = value;
    }
    /**
     * Sends data over the websocket.
     *
     * If the websocket is not connected and a buffer was provided on creation, the data will be added to the buffer.
     * If no buffer was provided or the websocket was closed by the user, the data will be dropped.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
     * @param data to send.
     */
    send(data) {
      if (this.closedByUser)
        return;
      if (this._underlyingWebsocket.readyState === this._underlyingWebsocket.OPEN) {
        this._underlyingWebsocket.send(data);
      } else if (this.buffer !== void 0) {
        this.buffer.add(data);
      }
    }
    /**
     * Close the websocket. No connection-retry will be attempted after this.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close
     * @param code optional close code.
     * @param reason optional close reason.
     */
    close(code, reason) {
      this.cancelScheduledConnectionRetry();
      this._closedByUser = true;
      this._underlyingWebsocket.close(code, reason);
    }
    /**
     * Adds an event listener for the given event-type.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     * @param type of the event to add the listener for.
     * @param listener to add.
     * @param options to use when adding the listener.
     */
    addEventListener(type, listener, options) {
      this._options.listeners[type].push({ listener, options });
    }
    /**
     * Removes one or more event listener for the given event-type that match the given listener and options.
     *
     * @param type of the event to remove the listener for.
     * @param listener to remove.
     * @param options that were used when the listener was added.
     */
    removeEventListener(type, listener, options) {
      const isListenerNotToBeRemoved = (l) => l.listener !== listener || l.options !== options;
      this._options.listeners[type] = this._options.listeners[type].filter(isListenerNotToBeRemoved);
    }
    /**
     * Creates a new browser-native websocket and connects it to the given URL with the given protocols
     * and adds all event listeners to the browser-native websocket.
     *
     * @return the created browser-native websocket which is also stored in the '_underlyingWebsocket' property.
     */
    tryConnect() {
      this._url = typeof this._urlProvider === "function" ? this._urlProvider() : this._urlProvider;
      this._underlyingWebsocket = new WebSocket(this._url, this.protocols);
      this._underlyingWebsocket.addEventListener(WebsocketEvent.open, this.handleOpenEvent);
      this._underlyingWebsocket.addEventListener(WebsocketEvent.close, this.handleCloseEvent);
      this._underlyingWebsocket.addEventListener(WebsocketEvent.error, this.handleErrorEvent);
      this._underlyingWebsocket.addEventListener(WebsocketEvent.message, this.handleMessageEvent);
      return this._underlyingWebsocket;
    }
    /**
     * Removes all event listeners from the browser-native websocket and closes it.
     */
    clearWebsocket() {
      this._underlyingWebsocket.removeEventListener(WebsocketEvent.open, this.handleOpenEvent);
      this._underlyingWebsocket.removeEventListener(WebsocketEvent.close, this.handleCloseEvent);
      this._underlyingWebsocket.removeEventListener(WebsocketEvent.error, this.handleErrorEvent);
      this._underlyingWebsocket.removeEventListener(WebsocketEvent.message, this.handleMessageEvent);
      this._underlyingWebsocket.close();
    }
    /**
     * Dispatch an event to all listeners of the given event-type.
     *
     * @param type of the event to dispatch.
     * @param event to dispatch.
     */
    dispatchEvent(type, event) {
      const eventListeners = this._options.listeners[type];
      const newEventListeners = [];
      eventListeners.forEach(({ listener, options }) => {
        listener(this, event);
        if (options === void 0 || options.once === void 0 || !options.once) {
          newEventListeners.push({ listener, options });
        }
      });
      this._options.listeners[type] = newEventListeners;
    }
    /**
     * Handles the given event by dispatching it to all listeners of the given event-type.
     *
     * @param type of the event to handle.
     * @param event to handle.
     */
    handleEvent(type, event) {
      switch (type) {
        case WebsocketEvent.close:
          this.dispatchEvent(type, event);
          this.scheduleConnectionRetryIfNeeded();
          break;
        case WebsocketEvent.open:
          if (this.backoff !== void 0 && this._lastConnection !== void 0) {
            const detail = {
              retries: this.backoff.retries,
              lastConnection: new Date(this._lastConnection)
            };
            const event2 = new CustomEvent(WebsocketEvent.reconnect, {
              detail
            });
            this.dispatchEvent(WebsocketEvent.reconnect, event2);
            this.backoff.reset();
          }
          this._lastConnection = /* @__PURE__ */ new Date();
          this.dispatchEvent(type, event);
          this.sendBufferedData();
          break;
        case WebsocketEvent.retry:
          this.dispatchEvent(type, event);
          this.clearWebsocket();
          this.tryConnect();
          break;
        default:
          this.dispatchEvent(type, event);
          break;
      }
    }
    /**
     * Sends buffered data if there is a buffer defined.
     */
    sendBufferedData() {
      if (this.buffer === void 0) {
        return;
      }
      for (let ele = this.buffer.read(); ele !== void 0; ele = this.buffer.read()) {
        this.send(ele);
      }
    }
    /**
     * Schedules a connection-retry if there is a backoff defined and the websocket was not closed by the user.
     */
    scheduleConnectionRetryIfNeeded() {
      if (this.closedByUser) {
        return;
      }
      if (this.backoff === void 0) {
        return;
      }
      const handleRetryEvent = (detail) => {
        const event = new CustomEvent(WebsocketEvent.retry, { detail });
        this.handleEvent(WebsocketEvent.retry, event);
      };
      const retryEventDetail = {
        backoff: this._options.retry.instantReconnect === true ? 0 : this.backoff.next(),
        retries: this._options.retry.instantReconnect === true ? 0 : this.backoff.retries,
        lastConnection: this._lastConnection
      };
      if (this._options.retry.maxRetries === void 0 || retryEventDetail.retries <= this._options.retry.maxRetries) {
        this.retryTimeout = globalThis.setTimeout(() => handleRetryEvent(retryEventDetail), retryEventDetail.backoff);
      }
    }
    /**
     * Cancels the scheduled connection-retry, if there is one.
     */
    cancelScheduledConnectionRetry() {
      globalThis.clearTimeout(this.retryTimeout);
    }
  };

  // ../node_modules/websocket-ts/dist/esm/src/websocket_builder.js
  var WebsocketBuilder = class {
    /**
     * Creates a new WebsocketBuilder.
     *
     * @param url the url to connect to, or a function that returns a URL
     */
    constructor(url) {
      this._url = url;
    }
    /**
     * Getter for the url.
     *
     * @returns the url or url provider
     */
    get url() {
      return this._url;
    }
    /**
     * Adds protocols to the websocket. Subsequent calls to this method will override the previously set protocols.
     *
     * @param protocols the protocols to add
     */
    withProtocols(protocols) {
      this._protocols = protocols;
      return this;
    }
    /**
     * Getter for the protocols.
     *
     * @returns the protocols, undefined if no protocols have been set
     */
    get protocols() {
      return this._protocols;
    }
    /**
     * Sets the maximum number of retries before giving up. No limit if undefined.
     *
     * @param maxRetries the maximum number of retries before giving up
     */
    withMaxRetries(maxRetries) {
      var _a;
      this._options = Object.assign(Object.assign({}, this._options), { retry: Object.assign(Object.assign({}, (_a = this._options) === null || _a === void 0 ? void 0 : _a.retry), { maxRetries }) });
      return this;
    }
    /**
     * Getter for the maximum number of retries before giving up.
     *
     * @returns the maximum number of retries before giving up, undefined if no maximum has been set
     */
    get maxRetries() {
      var _a, _b;
      return (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.retry) === null || _b === void 0 ? void 0 : _b.maxRetries;
    }
    /**
     * Sets whether to reconnect immediately after a connection has been lost, ignoring the backoff strategy for the first retry.
     *
     * @param instantReconnect whether to reconnect immediately after a connection has been lost
     */
    withInstantReconnect(instantReconnect) {
      var _a;
      this._options = Object.assign(Object.assign({}, this._options), { retry: Object.assign(Object.assign({}, (_a = this._options) === null || _a === void 0 ? void 0 : _a.retry), { instantReconnect }) });
      return this;
    }
    /**
     * Getter for whether to reconnect immediately after a connection has been lost, ignoring the backoff strategy for the first retry.
     *
     * @returns whether to reconnect immediately after a connection has been lost, undefined if no value has been set
     */
    get instantReconnect() {
      var _a, _b;
      return (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.retry) === null || _b === void 0 ? void 0 : _b.instantReconnect;
    }
    /**
     * Adds a backoff to the websocket. Subsequent calls to this method will override the previously set backoff.
     *
     * @param backoff the backoff to add
     */
    withBackoff(backoff) {
      var _a;
      this._options = Object.assign(Object.assign({}, this._options), { retry: Object.assign(Object.assign({}, (_a = this._options) === null || _a === void 0 ? void 0 : _a.retry), { backoff }) });
      return this;
    }
    /**
     * Getter for the backoff.
     *
     * @returns the backoff, undefined if no backoff has been set
     */
    get backoff() {
      var _a, _b;
      return (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.retry) === null || _b === void 0 ? void 0 : _b.backoff;
    }
    /**
     * Adds a buffer to the websocket. Subsequent calls to this method will override the previously set buffer.
     *
     * @param buffer the buffer to add
     */
    withBuffer(buffer) {
      this._options = Object.assign(Object.assign({}, this._options), { buffer });
      return this;
    }
    /**
     * Getter for the buffer.
     *
     * @returns the buffer, undefined if no buffer has been set
     */
    get buffer() {
      var _a;
      return (_a = this._options) === null || _a === void 0 ? void 0 : _a.buffer;
    }
    /**
     * Adds an 'open' event listener to the websocket. Subsequent calls to this method will add additional listeners that will be
     * called in the order they were added.
     *
     * @param listener the listener to add
     * @param options the listener options
     */
    onOpen(listener, options) {
      this.addListener(WebsocketEvent.open, listener, options);
      return this;
    }
    /**
     * Adds an 'close' event listener to the websocket. Subsequent calls to this method will add additional listeners that will be
     * called in the order they were added.
     *
     * @param listener the listener to add
     * @param options the listener options
     */
    onClose(listener, options) {
      this.addListener(WebsocketEvent.close, listener, options);
      return this;
    }
    /**
     * Adds an 'error' event listener to the websocket. Subsequent calls to this method will add additional listeners that will be
     * called in the order they were added.
     *
     * @param listener the listener to add
     * @param options the listener options
     */
    onError(listener, options) {
      this.addListener(WebsocketEvent.error, listener, options);
      return this;
    }
    /**
     * Adds an 'message' event listener to the websocket. Subsequent calls to this method will add additional listeners that will be
     * called in the order they were added.
     *
     * @param listener the listener to add
     * @param options the listener options
     */
    onMessage(listener, options) {
      this.addListener(WebsocketEvent.message, listener, options);
      return this;
    }
    /**
     * Adds an 'retry' event listener to the websocket. Subsequent calls to this method will add additional listeners that will be
     * called in the order they were added.
     *
     * @param listener the listener to add
     * @param options the listener options
     */
    onRetry(listener, options) {
      this.addListener(WebsocketEvent.retry, listener, options);
      return this;
    }
    /**
     * Adds an 'reconnect' event listener to the websocket. Subsequent calls to this method will add additional listeners that will be
     * called in the order they were added.
     *
     * @param listener the listener to add
     * @param options the listener options
     */
    onReconnect(listener, options) {
      this.addListener(WebsocketEvent.reconnect, listener, options);
      return this;
    }
    /**
     * Builds the websocket.
     *
     * @return a new websocket, with the set options
     */
    build() {
      return new Websocket(this._url, this._protocols, this._options);
    }
    /**
     * Adds an event listener to the options.
     *
     * @param event the event to add the listener to
     * @param listener the listener to add
     * @param options the listener options
     */
    addListener(event, listener, options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
      this._options = Object.assign(Object.assign({}, this._options), { listeners: {
        open: (_c = (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.listeners) === null || _b === void 0 ? void 0 : _b.open) !== null && _c !== void 0 ? _c : [],
        close: (_f = (_e = (_d = this._options) === null || _d === void 0 ? void 0 : _d.listeners) === null || _e === void 0 ? void 0 : _e.close) !== null && _f !== void 0 ? _f : [],
        error: (_j = (_h = (_g = this._options) === null || _g === void 0 ? void 0 : _g.listeners) === null || _h === void 0 ? void 0 : _h.error) !== null && _j !== void 0 ? _j : [],
        message: (_m = (_l = (_k = this._options) === null || _k === void 0 ? void 0 : _k.listeners) === null || _l === void 0 ? void 0 : _l.message) !== null && _m !== void 0 ? _m : [],
        retry: (_q = (_p = (_o = this._options) === null || _o === void 0 ? void 0 : _o.listeners) === null || _p === void 0 ? void 0 : _p.retry) !== null && _q !== void 0 ? _q : [],
        reconnect: (_t = (_s = (_r = this._options) === null || _r === void 0 ? void 0 : _r.listeners) === null || _s === void 0 ? void 0 : _s.reconnect) !== null && _t !== void 0 ? _t : [],
        [event]: [
          ...(_w = (_v = (_u = this._options) === null || _u === void 0 ? void 0 : _u.listeners) === null || _v === void 0 ? void 0 : _v[event]) !== null && _w !== void 0 ? _w : [],
          { listener, options }
        ]
      } });
      return this;
    }
  };

  // websocket_connection.ts
  var WebsocketManager = class {
    constructor() {
      this.ws = new WebsocketBuilder(CHAT_WS_URL).withBuffer(new ArrayQueue()).withBackoff(new ConstantBackoff(1e3)).build();
    }
    sendMessage(message) {
      this.ws.send(message);
    }
    addEventListeners(open, close, message) {
      this.ws.addEventListener(WebsocketEvent.open, open);
      this.ws.addEventListener(WebsocketEvent.close, close);
      this.ws.addEventListener(WebsocketEvent.message, message);
    }
  };

  // ws_messages/message.ts
  var AuthRequest = class {
    constructor(user_id, token2) {
      this.user_id = user_id;
      this.token = token2;
    }
  };
  var UserMessage = class {
    constructor(type, content) {
      this.message_type = type;
      this.content = content;
    }
  };

  // index.ts
  var token = localStorage.getItem("access_token");
  var wsManager = new WebsocketManager();
  var sidebar = new SidebarUI();
  if (token != null) {
    wsManager.addEventListeners(
      // On open
      () => {
        console.log("Open connection!");
        const auth_msg = new UserMessage(
          "AUTH_CHECK" /* AUTH_CHECK */,
          JSON.stringify(
            new AuthRequest(
              parseInt(localStorage.getItem("user_id")),
              localStorage.getItem("access_token")
            )
          )
        );
        wsManager.sendMessage(JSON.stringify(auth_msg));
        const get_chats_msg = new UserMessage(
          "GET_CHATS" /* GET_CHATS */,
          ""
        );
        wsManager.sendMessage(JSON.stringify(get_chats_msg));
      },
      // On close 
      () => {
        console.log("Close connection!");
      },
      // On message
      (i, ev) => {
        try {
          const ans = JSON.parse(ev.data);
          switch (ans["message_type"]) {
            // Auth check
            case "AUTH_CHECK" /* AUTH_CHECK */: {
              if (ans["content"] == "ACCESS_DENIED") {
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                window.location.replace("/sign_in");
              } else {
                console.log("Access to user allowed!");
              }
              break;
            }
            // Get chats
            case "GET_CHATS" /* GET_CHATS */: {
              console.log(ans["content"]);
              const chats = Object.assign(new ChatsInfo(), JSON.parse(ans["content"]));
              console.log(chats);
              sidebar.setupChats(chats);
              break;
            }
          }
        } catch (error) {
          console.log("Server message: ", ev.data);
        }
      }
    );
    const create_new_chat_button = document.querySelector("#sidebar__create-chat");
    create_new_chat_button?.addEventListener("click", (event) => {
      console.log(event.currentTarget);
    });
  } else {
    window.location.replace(SIGN_IN_URL);
  }
})();
