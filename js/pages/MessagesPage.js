// TODO: remove code duplication
export default class MessagesPage {
  constructor(context) {
    this._context = context;
    this._rootEl = context.rootEl();
    this._websocket = null;
  }

  init() {
    this._rootEl.innerHTML = `
      <div class="container h-100">
        <div class="h-100 d-flex flex-column">
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">МирОК</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-supported-content">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbar-supported-content">
              <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                  <a class="nav-link" data-id="menu-main" href="/wall">Новости</a>
                </li>
                <li class="nav-item active">
                  <a class="nav-link" data-id="menu-messages" href="/messages">Чат</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" data-id="menu-files" href="/container">Файлы</a>
                </li>
              </ul>
              <form data-id="logout-form" class="form-inline my-2 my-lg-0">
                <button class="btn btn-outline-danger my-2 my-sm-0" type="submit">Выйти</button>
              </form>
            </div>
          </nav>
          <div class="row messages flex-grow-1">
            <div class="col" data-id="messages-container"></div>
          </div>
          <div class="row pt-1 pb-1">
            <div class="col">
              <form data-id="message-form">
                <div class="row">
                  <div class="col">
                    <input type="text" data-id="message-input" class="form-control" >
                  </div>
                  <div class="col-3">
                    <button type="submit" class="form-control btn btn-primary">Отправить</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" data-id="error-modal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Ошибка!</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div data-id="error-message" class="modal-body">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this._rootEl.querySelector('[data-id=menu-main]').addEventListener('click', evt => {
      evt.preventDefault();
      this._context.route(evt.currentTarget.getAttribute('href'));
    });
    this._rootEl.querySelector('[data-id=menu-messages]').addEventListener('click', evt => {
      evt.preventDefault();
    });
    this._rootEl.querySelector('[data-id=menu-files]').addEventListener('click', evt => {
      evt.preventDefault();
      this._context.route(evt.currentTarget.getAttribute('href'));
    });

    this._logoutForm = this._rootEl.querySelector('[data-id=logout-form]');
    this._logoutForm.addEventListener('submit', evt => {
      evt.preventDefault();
      this._context.logout();
    });

    this._messageFormEl = this._rootEl.querySelector('[data-id=message-form]');
    this._messageInputEl = this._messageFormEl.querySelector('[data-id=message-input]');

    this._messageFormEl.addEventListener('submit', evt => {
      evt.preventDefault();
      let message = JSON.parse(localStorage.getItem('profile')).name;
      message += ': ' + this._messageInputEl.value;
      if (this._websocket !== null && this._websocket.readyState === 1) {
        try {
          this._websocket.send(JSON.stringify({type: 'message', content: message}));
          this._messageInputEl.value = '';
        } catch (e) {
          this.showError('error.message_send');
        }
      }
    });

    this._errorModal = $('[data-id=error-modal]');
    this._errorMessageEl = this._rootEl.querySelector('[data-id=error-message]');

    this._messagesContainerEl = this._rootEl.querySelector('[data-id=messages-container]');
    this.connect();
  }

  showError(error) {
    const data = JSON.parse(error);
    const message = this._context.translate(data.message);
    this._errorMessageEl.textContent = message;
    this._errorModal.modal('show');
  }

  connect() {
    this._websocket = new WebSocket(this._context.webSocketUrl());
    this._websocket.addEventListener('open', evt => {
      evt.currentTarget.send(JSON.stringify({
        type: 'connect',
        content: null,
      }));
    });
    this._websocket.addEventListener('message', evt => {
      const incomingEl = document.createElement('div');
      incomingEl.className = 'alert alert-light mt-1 mb-1';
      const incoming = JSON.parse(evt.data);

      if (incoming.type === 'message') {
        incomingEl.textContent = `${incoming.content}`;
        this._messagesContainerEl.appendChild(incomingEl);
        incomingEl.scrollIntoView(false);
      }
    });

    this._websocket.addEventListener('error', evt => {
      console.log(evt);
    });
    this._websocket.addEventListener('close', evt => {
      setTimeout(() => this.connect(), 1000);
    });
  }

  disconnect() {
    if (this._websocket !== null) {
      try {
        this._websocket.close(1000);
        this._websocket = null;
      } catch (e) {
        console.error(e);
      }
    }
  }

  destroy() {
    this.disconnect();
  }
}
