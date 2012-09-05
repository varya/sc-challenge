Sound Cloud Challenge
============

## Task
 * This web app should allow users to create playlists of ANY tracks on SoundCloud.
 * A user should be able to store, edit and delete the playlists.
 * A user should be able to play all the tracks in the playlist with one click or tap.
 * A user should be able to give a playlist a title and description.

## Usage
The application is hosted at http://toivonen.github.com/sc-challenge/ and allows a user to do the things listed in the task.
Such as:
 * Creating playlists (click the "plus" button)
 * Searching for tracks (use search form)
 * Adding a track to a current playlist (click a track in the search result list)
 * Changing a playlist title and description (click them to be able to change)
 * Removing tracks from a playlist (click the "trash" button)
 * Removing playlists (click the "trash" button)
 * Saving a playlist with their chosen tracks (occurs in the background)
 * Playing all the tracks in a playlist from the first to the last (click "play" button)
 * Stopping a playlist (click a blue "play" button)

The application does not allow (yet):
 * Playing a particular track in the list
 * Pausing play of the list/track
 * Undoing user actions
 * Changing track position in its playlist
 * Changing playlist position
 * Displaying more than 50 search results

But it:
  * works in Opera
  * works in IE7 (not tested under IE6)
  * works in Safari 6
  * works in Chrome 

All these not yet written features are not very complicated, but will just take time to implement.
As for this application, it is mostly to represent the architectural ideas. With such a design
structure any further refactoring should not be a problem.
Read the explanation below.

## Application idea
### A piece of theory
The application is implemented using BEM methodogy and some BEM code which has already been written and used.
BEM works with all of the technologies usually used for web interface objects (CSS, templates, JavaScript).

To learn about BEM methodology, check out the following links in English:
  * [A new method to develop frontend](http://coding.smashingmagazine.com/front-end-methodology-bem-file-system-representation/)
  @ SmashingMagazine
  * [How to use BEM outside Yandex](https://vimeo.com/38346573) screencast presentation
  * [The Case of the Wonderful Button](https://vimeo.com/44013317) screencast presentation

There is also a lot of information in Russian:
 * [BEM videos](https://vimeo.com/user7969200/videos) from many conferences
 * [BEM club](http://clubs.ya.ru/bem/)

### Code reuse
This application uses the [bem-bl block library](https://github.com/bem/bem-bl):
 * [bem-bl repo](https://github.com/bem/bem-bl)
 * [bem-bl Documentation Site in English](http://bem.github.com/bem-bl/index.en.html)
 * [bem-bl Documentation Site in Russian](http://bem.github.com/bem-bl/index.ru.html). More information here.

Also it uses some blocks borrowed from the Yandex internal library, which are placed into the [blocks-ya](https://github.com/toivonen/sc-challenge/tree/master/blocks-ya)
level in the application repo.

### JavaScript approach
JavaScript code for all of the blocks is written in terms of BEM. This is possible with
a helper block [i-bem](http://bem.github.com/bem-bl/sets/common-desktop/i-bem/i-bem.ru.html)
provided by ``bem-bl`` block library.
Unfortunatelly there is currently no documentation in English about it (even the JsDoc is in Russian).

In short, the important ideas are the following:
 * Each block has a JavaSript ``class``.
 * Each block representation is an ``instance`` of its class.
 * A block (class) is described declaratively.
 * A block (and its elements) can react on setting (or deleteing) their modifiers doing something.
 * Many helpers for event delegation ideas.
 * Lazy initialization for blocks.

### Tempates
A special JavaScript-based template engine is used to turn data into HTML.

The basic information is in [xjst repo](https://github.com/veged/xjst) (in English) and at the
[BEMHTML syntax documentation](http://bem.github.com/bem-bl/pages/bemhtml-syntax/bemhtml-syntax.ru.html)
in Russian.

Briefly, it is as declarative as XSLT but as fast as JavaScript. Actually BEMHTML code turns into ugly plain JavaScript
when compiling the project.

It is possible to be run on both client and server sides. For this application ``BEMHTML`` is
run on server under Node.js to build a pure HTML page with only a ``b-page`` block
represented. And then, all other blocks are the result of running templates on the client.

## How it works
The source data of the page is ``index.bemjson.js`` file.

There are building instructions in
``GNUmakefile`` to build ``*.html``, ``*.css``, ``*.js`` and ``*.bemhtml.js`` files.
It is defined as to which levels are to be used when building. A ``bem build`` command from [bem-tools](https://github.com/bem/bem-tools)
compiles the page technologies. It is important to note that it picks up not only
the declared block but also the ones which are mentioned in ``dependencies`` (look for ``*.deps.js`` files for blocks).

## Advantages
Speaking about advantages of using BEM for this application I would like to say:

#### Code reuse
Every technology in BEM has its own sort of inheritance. So, it is posible to reuse code from libraries by tuning it
for a particular project.

#### Encapsulation
The application is divided into independent parts (which are the blocks). So, it makes it possible to keep the code in order.

The example of encapsulation is ``i-storage`` block. It provides an interface to set and get data. In this case it is
``window.localStorage``. But having this interface encapsulated into a
detached block makes it possible to redefine this piece in the future without changing a bit
in the functioning blocks.

### Event delegation
All the events are watched using the idea of delegation. DOM event handlers are binded to
the ``document`` object, and BEM events are delegated from an instance to its class.

### Declarative approach
Defining ##onSetMod## and ##onElemSetMod## properties makes it possible to describe a block reaction
at the setting of a modifier to a block or its element. With this it is easy to make the block consistent.
The advantage is a well-designed application and fewer bugs.

### Live (lazy) initialization
Special methods are used to ensure that an instance (block) JavaScript object occurs in
the browser memory only when it is needed. For example, when a user clicks a particular block element.