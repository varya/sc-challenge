Sound Cloud Challenge
============

## Task
 * Web app allows users to create playlists of ANY tracks on SoundCloud.
 * A user should be able to store, edit and delete the playlists.
 * A user should be able to play all the tracks in the playlist with one click or tap.
 * A user should be able to give a playlist a title and description.

## Usage
The application is hosted at http://toivonen.github.com/sc-challenge/ and allows to do the things listed in the task.
Such as:
 * Creating playlists (click the "plus" button)
 * Searching tracks (use search form)
 * Adding a track to a current playlist (click a track in the search result list)
 * Changing playlist title and description (click at them to be able to change)
 * Removing tracks from a playlist (click the "trash" button)
 * Removing playlists (click the "trash" button)
 * Saving playlist with their tracks (occurs in the background)
 * Playing all the tracks in a playlist fron the first to the last (click "play" button)
 * Stopping to play a playlist (click a pink "play" button)

The application does not allow (yet):
 * to play a particular track in the list
 * to pause playing the list/track
 * to undo user actions
 * to change track position in its playlist
 * to change playlist position

All these features are not very complicated but just take time to implement. As for this application, it is
mostly to represent the architectural ideas. With such a design structure any further refactoring should not be a problem.
Read the explanation below.

## Application idea
### A piece of theory
The application is implemented using BEM methodogy and some BEM code which is already written and used.
BEM is a thing to work with web interface objects in all the technologies (CSS, templates, JavaScript).

To learn about BEM methodology, check in English:
  * [A new method to develop frontend](http://coding.smashingmagazine.com/front-end-methodology-bem-file-system-representation/)
  @ SmashingMagazine
  * [How to use BEM outside Yandex](https://vimeo.com/38346573) screencast presentation
  * [The Case of the Wonderful Button](https://vimeo.com/44013317) screencast presentation

There is also a lot of information in Russian:
 * [BEM videos](https://vimeo.com/user7969200/videos) from many conferences
 * [BEM club](http://clubs.ya.ru/bem/)

### Code reuse
This application uses [bem-bl block library](https://github.com/bem/bem-bl):
 * [bem-bl repo](https://github.com/bem/bem-bl)
 * [bem-bl Documentation Site in English](http://bem.github.com/bem-bl/index.en.html)
 * [bem-bl Documentation Site in Russian](http://bem.github.com/bem-bl/index.ru.html). More information here.

Also it uses some blocks borrowed from Yandex internal library which are placed into [blocks-ya](https://github.com/toivonen/sc-challenge/tree/master/blocks-ya)
level in the application repo.

### JavaScript approach
JavaScript code for all the blocks is written in terms of BEM. This is possible with a helper block [i-bem](http://bem.github.com/bem-bl/sets/common-desktop/i-bem/i-bem.ru.html)
provided by ``bem-bl`` block library.
Unfortunatelly there is no documentation in English about it (even JsDoc is in Russian).
In short, the ideas are the following:
 * Each block has a JavaSript ``class``.
 * Each block representation is an instanse of its class.
 * Block (class) is describing declaratively.
 * Block (and its elements) can react on setting (or deletting) their modifiers doing something.
 * Many helpers for event delegation idea.
 * Lazy initialization for blocks.

### Tempates
A special JavaScript-based template engine is used to turn data into HTML.

Base information is in [xjst repo](https://github.com/veged/xjst) (in English) and at the
[BEMHTML syntax documentation](http://bem.github.com/bem-bl/pages/bemhtml-syntax/bemhtml-syntax.ru.html)
in Russian.

Briefly, it is declarative as XSLT but fast as JavaScript. Actually BEMHTML code turns into ugly plain JavaScript
when compiling the project.

It is possible to be run on both client and server side. For this application ``BEMHTML`` is
run on server under Node.js for building a pure HTML page with only ``b-page`` block
representing. And then, all other blocks are the result of running templates on client.

## How it works
The source data of the page is ``index.bemjson.js`` file.

There are building instructions in
``GNUmakefile`` to build ``*.html``, ``*.css``, ``*.js`` and ``*.bemhtml.js`` files.
It is defining which levels are to be used when building. A ``bem build`` command from [bem-tools](https://github.com/bem/bem-tools)
compiles page technologies. Important that it picks up not only
the declared block but also the ones which are mentioned in ``dependencies`` (look for ``*.deps.js`` files for blocks).