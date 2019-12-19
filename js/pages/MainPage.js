export default class MainPage {
    lastId = 0;
    firstId = 0;

    constructor(context) {
        this._context = context;
        this._rootEl = context.rootEl();
    }

    init() {
        this._rootEl.innerHTML = `
      <div class="container">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="#">МирОК</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-supported-content">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbar-supported-content">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <a class="nav-link" data-id="menu-main" href="/wall">Новости</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-id="menu-messages" href="/messages">Чат</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-id="menu-files" href="/container">Файлы</a>
              </li>
            </ul>
            <form data-id="search-form" class="form-inline my-2 my-lg-0">
              <input class="form-control mr-sm-2" type="search" placeholder="Search" data-id="search-input">
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit" style="margin-right: 5px">Поиск</button>
            </form>
            <form data-id="logout-form" class="form-inline my-2 my-lg-0">
              <button class="btn btn-outline-danger my-2 my-sm-0" type="submit">Выйти</button>
            </form>
          </div>
        </nav>
        <form data-id="news-button-form" class="form-inline my-2 my-lg-0">
          <div class="col text-center" style="margin-top: 10px">
            <a href="#" data-action="create-new-news" class="btn btn-outline-primary" style="min-width: 100%; margin: 10px;">Добавить новость</a>
          </div>
        </form>
        <form data-id="news-button-form-back" class="form-inline my-2 my-lg-0" style="display: none">
          <div class="col text-center" style="margin-top: 10px">
            <a href="#" data-action="create-new-news" class="btn btn-outline-primary" style="min-width: 100%; margin: 10px;">Назад</a>
          </div>
        </form>
        <div class="row" data-id="new-posts" style="min-height: 20px"> 
        </div>  
        <div class="row" data-id="news-form" style="display: none">
            <div class="col">
              <div class="card">
                <div class="card-body">
                  <form data-id="post-edit-form">
                    <input type="hidden" data-id="id-input" value="0">
                    <div class="form-group">
                      <label for="header-input">Заголовок</label>
                      <input type="text" data-id="header-input" class="form-control" id="header-input">
                    </div>
                    <div class="form-group">
                      <label for="exampleFormControlTextarea1">Описание новости</label>
                      <textarea class="form-control" data-id="content-input" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                      <div class="custom-file">
                        <input type="hidden" data-id="media-name-input">
                        <input type="file" data-id="media-input" class="custom-file-input" id="media-input">
                        <label class="custom-file-label" for="media-input">Выберите файл</label>
                      </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Сохранить</button>
                    <div style="float: right">
                        <form name="f1">
                            <input data-id="menu-checkbox" type="checkbox" name="yourName" id="ch1"> Отправить в Вк
                        </form>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        </div>
        <div class="row" data-id="posts-container">
        </div>
        <form data-id="button-next" class="form-inline my-2 my-lg-0">
          <div class="col text-center" style="margin-top: 10px">
            <a href="#" data-action="create-next-news" class="btn btn-outline-primary" style="min-width: 100%; margin: 10px;">Ещё новости</a>
          </div>
        </form>
      </div>
      <!-- TODO: https://getbootstrap.com/docs/4.4/components/modal/ -->
      <div class="modal fade" data-id="error-modal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Error!</h5>
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

        let element = document.querySelector('[data-id=menu-checkbox]');

        this._rootEl.querySelector('[data-id=menu-main]').addEventListener('click', evt => {
            evt.preventDefault();
        });
        this._rootEl.querySelector('[data-id=menu-messages]').addEventListener('click', evt => {
            evt.preventDefault();
            this._context.route(evt.currentTarget.getAttribute('href'));
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

        this._errorModal = $('[data-id=error-modal]'); // jquery
        this._errorMessageEl = this._rootEl.querySelector('[data-id=error-message]');


        this._newPostsEl = this._rootEl.querySelector('[data-id=new-posts]');
        this._postsContainerEl = this._rootEl.querySelector('[data-id=posts-container]');
        this._postCreateFormEl = this._rootEl.querySelector('[data-id=post-edit-form]');
        this._idInputEl = this._postCreateFormEl.querySelector('[data-id=id-input]');
        this._contentInputEl = this._postCreateFormEl.querySelector('[data-id=content-input]');
        this._headerInputEl = this._postCreateFormEl.querySelector('[data-id=header-input]');
        this._mediaNameInputEl = this._postCreateFormEl.querySelector('[data-id=media-name-input]');
        this._mediaInputEl = this._postCreateFormEl.querySelector('[data-id=media-input]');
        this._searchFormEl = this._rootEl.querySelector('[data-id=search-form]');
        this._searchInputEl = this._searchFormEl.querySelector('[data-id="search-input"]');
        this._newsForm = this._rootEl.querySelector('[data-id="news-form"]');
        this._newsButtonForm = this._rootEl.querySelector('[data-id="news-button-form"]');
        this._newsButtonFormBack = this._rootEl.querySelector('[data-id="news-button-form-back"]');
        this._buttonFormNext = this._rootEl.querySelector('[data-id="button-next"]');
        this._createNewNews = this._newsButtonForm.querySelector('[data-id="create-new-news"]');

        this._buttonFormNext.addEventListener('click', evt => {
            evt.preventDefault();
            this.loadNext();
        });

        this._newsButtonForm.addEventListener('click', evt => {
            evt.preventDefault();
            this._postsContainerEl.innerHTML = '';
            this.goVisibilityNewsForm();
            this._newsButtonForm.style.display = "none";
            this._newsButtonFormBack.style.display = "block";
            this._buttonFormNext.style.display = "none";
            this._newPostsEl.style.display = "none";
        });

        this._newsButtonFormBack.addEventListener('click', evt => {
            evt.preventDefault();
            this.loadFirst();
            this.goInvisibilityNewsForm();
            this._newsButtonForm.style.display = "block";
            this._newsButtonFormBack.style.display = "none";
            this._buttonFormNext.style.display = "block";
            this._newPostsEl.style.display = "block";
        });

        this._searchFormEl.addEventListener('submit', evt => {
            evt.preventDefault();
            const str = '?q=' + this._searchInputEl.value;
            console.log(this._searchInputEl.value);
            this._context.get('/posts/search' + str, {},
                text => {
                    const posts = JSON.parse(text);
                    this.rebuild(posts);
                },
                error => {
                    this.showError(error);
                });
        });

        this._mediaInputEl.addEventListener('change', evt => {
            const [file] = Array.from(evt.currentTarget.files);
            const formData = new FormData();
            formData.append('file', file);
            this._context.post('/files/multipart', formData, {},
                text => {
                    const data = JSON.parse(text);
                    this._mediaNameInputEl.value = data.name;
                },
                error => {
                    this.showError(error);
                });
        });

        this._postCreateFormEl.addEventListener('submit', evt => {
            evt.preventDefault();
            const aId = JSON.parse(localStorage.getItem('profile')).id;
            const data = {
                id: Number(this._idInputEl.value),
                content: this._contentInputEl.value,
                media: this._mediaNameInputEl.value || null,
                heading: this._headerInputEl.value,
                authorId: aId
            };
            this._context.post('/posts', JSON.stringify(data), {'Content-Type': 'application/json'},
                text => {
                    this._idInputEl.value = 0;
                    this._contentInputEl.value = '';
                    this._mediaNameInputEl.value = '';
                    this._mediaInputEl.value = '';
                    this._headerInputEl.value = '';
                    this.goInvisibilityNewsForm();
                    this._newsButtonForm.style.display = "block";
                    this._newsButtonFormBack.style.display = "none";
                    this._buttonFormNext.style.display = "block";
                    this.loadFirst();
                    console.log(element.checked);
                    if (element.checked) {
                        this.loadPy();
                    }
                },
                error => {
                    this.showError(error);
                });
        });
        this.loadFirst();
        this.pollNewPosts();
    }

    loadFirst() {
        this._context.get('/posts', {},
            text => {
                const posts = JSON.parse(text);
                this.rebuildList(posts);
            },
            error => {
                this.showError(error);
            });
    }

    loadNext() {
        this._context.get(`/posts/after/${this.lastId}`, {},
            text => {
                const posts = JSON.parse(text);
                if (posts.length < 4) {
                    this._buttonFormNext.style.display = "none";
                }
                this.rebuildListAfterClickButton(posts);
            },
            error => {
                this.showError(error);
            });
    }

    check(document) {
        document.f1.ch1.checked = true;
    }

    createQuantityNewPosts(QuantityPosts) {
        this._newPostsEl.innerHTML = '';
        const QuantityNewPosts = document.createElement('div');
        QuantityNewPosts.className = 'col-12';
        QuantityNewPosts.innerHTML = `
            <div class="container col text-center" style="margin-top: 10px">
                <a href="#" data-action="go-new-posts" style="min-width: 100%">Новые новости: ${QuantityPosts}</a>      
            </div>
    `;
        QuantityNewPosts.querySelector('[data-action=go-new-posts]').addEventListener('click', evt => {
            evt.preventDefault();
            this.loadFirst();
            this._newPostsEl.innerHTML = '';
        });

        this._newPostsEl.appendChild(QuantityNewPosts);
    }

    loadQuantityNewPosts() {
        this._context.get(`/posts/before/${this.firstId}`, {},
            text => {
                const quantity = JSON.parse(text);
                if (quantity !== 0) {
                    this.createQuantityNewPosts(quantity);
                }
            },
            error => {
                this.showError(error);
            });
    }


    rebuildList(posts) {
        this._postsContainerEl.innerHTML = '';
        const [first] = posts;
        this.firstId = first.id;
        this.rebuild(posts);
    }

    rebuildListAfterClickButton(posts) {
        this.rebuild(posts);
    }

    rebuildOne(post) {
        this._postsContainerEl.innerHTML = '';
        const postEl = document.createElement('div');
        postEl.className = 'col-12';

        let postMedia = '';
        if (post.media !== null) {
            if (post.media.endsWith('.png') || post.media.endsWith('.jpg')) {
                postMedia += `
            <img src="${this._context.mediaUrl()}/${post.media}" class="card-img-top" alt="...">
          `;
            } else if (post.media.endsWith('.mp4') || post.media.endsWith('.webm')) {
                postMedia = `
            <div class="card-img-topcard-img-top embed-responsive embed-responsive-16by9 mb-2">
              <video src="${this._context.mediaUrl()}/${post.media}" class="embed-responsive-item" controls>
            </div>
          `;
            } else if (post.media.endsWith('.mp3')) {
                postMedia = `
            <div class = "card-img-topcard-img-top embed-responsive embed-responsive-16by9 mb-2">
              <audio src = "${this._context.mediaUrl()}/${post.media}" class = "embed-responsive-item" controls>
            </div>
          `;
            }
        }

        postEl.innerHTML = `
        <div class="card mt-2">
          ${postMedia}
          <div class="card-body">
            <p href="#" data-action="News" class="card-link">${post.content}</p>
            <p class="card-text">Оценка: ${post.likes}</p>
          </div>
        </div>
      `;
        this._postsContainerEl.appendChild(postEl);
    }

    rebuild(posts) {
        for (const post of posts) {
            this.lastId = post.id;
            const postEl = document.createElement('div');
            postEl.className = 'col-6';

            let postMedia = '';
            if (post.media !== null) {
                if (post.media.endsWith('.png') || post.media.endsWith('.jpg')) {
                    postMedia += `
            <img src="${this._context.mediaUrl()}/${post.media}" class="card-img-top" alt="...">
          `;
                } else if (post.media.endsWith('.mp4') || post.media.endsWith('.webm')) {
                    postMedia = `
            <div class="card-img-topcard-img-top embed-responsive embed-responsive-16by9 mb-2">
              <video src="${this._context.mediaUrl()}/${post.media}" class="embed-responsive-item" controls>
            </div>
          `;
                } else if (post.media.endsWith('.mp3')) {
                    postMedia = `
            <div>
              <audio src = "${this._context.mediaUrl()}/${post.media}" class = "embed-responsive-item" style="width: 100%" controls>
            </div>
          `;
                }
            }

            postEl.innerHTML = `
        <div class="card mt-2">
          ${postMedia}
          <div class="card-body">
            <a href="#" data-action="News" class="card-link">${post.heading}</a>
            <p class="card-text">Оценка: ${post.likes}</p>
          </div>
          <div class="card-footer">
            <div class="row">
              <div class="col">
                <a href="#" data-action="like" class="btn btn-sm btn-primary">Лайк</a>
                <a href="#" data-action="dislike" class="btn btn-sm btn-danger">Дислайк</a>
              </div>
              <div class="col text-right">
                <a href="#" data-action="edit" class="btn btn-sm btn-primary">Редактировать</a>
                <a href="#" data-action="remove" class="btn btn-sm btn-danger">Удалить</a>
              </div>
            </div>
          </div>
        </div>
      `;
            postEl.querySelector('[data-action=News]').addEventListener('click', evt => {
                evt.preventDefault();
                this._postsContainerEl.innerHTML = '';
                this._newsButtonForm.style.display = "none";
                this._newsButtonFormBack.style.display = "block";
                this._buttonFormNext.style.display = "none";
                this.rebuildOne(post)
            });
            postEl.querySelector('[data-action=like]').addEventListener('click', evt => {
                evt.preventDefault();
                this._context.post(`/posts/${post.id}/likes`, null, {},
                    () => {
                        this.loadFirst();
                    }, error => {
                        this.showError(error);
                    });
            });
            postEl.querySelector('[data-action=dislike]').addEventListener('click', evt => {
                evt.preventDefault();
                this._context.delete(`/posts/${post.id}/likes`, {},
                    () => {
                        this.loadFirst();
                    }, error => {
                        this.showError(error);
                    });
            });
            postEl.querySelector('[data-action=edit]').addEventListener('click', evt => {
                evt.preventDefault();
                this._idInputEl.value = post.id;
                this._contentInputEl.value = post.content;
                this._headerInputEl.value = post.heading;
                this._mediaNameInputEl.value = post.media;
                this._mediaInputEl.value = '';
                this._postsContainerEl.innerHTML = '';
                this.goVisibilityNewsForm();
                this._newsButtonForm.style.display = "none";
                this._newsButtonFormBack.style.display = "block";

            });
            postEl.querySelector('[data-action=remove]').addEventListener('click', evt => {
                evt.preventDefault();
                this._context.delete(`/posts/${post.id}`, {},
                    () => {
                        this.loadFirst();
                    }, error => {
                        this.showError(error);
                    });
            });
            this._postsContainerEl.appendChild(postEl);
        }
    }

    loadPy() {
        const x = new XMLHttpRequest();
        x.open("GET", "https://javaschoolvkbot.herokuapp.com", true);
        x.send(null);
    }

    goInvisibilityNewsForm() {
        this._newsForm.style.display = "none";
    }

    goVisibilityNewsForm() {
        this._newsForm.style.display = "block";
    }

    pollNewPosts() {
        this._timeout = setTimeout(() => {
            this.loadQuantityNewPosts();
            this.pollNewPosts();
        }, 5000);
    }

    showError(error) {
        const data = JSON.parse(error);
        const message = this._context.translate(data.message);
        this._errorMessageEl.textContent = message;
        this._errorModal.modal('show');
    }

    destroy() {
        clearTimeout(this._timeout);
    }
}
