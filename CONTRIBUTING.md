# Contributing

If you'd like to contribute patches to Datajam Chat, here are some useful notes on getting up and running.

## The Test App

Datajam Chat is a Rails engine, but it's tightly coupled to Datajam. It's an engine because it's meant to be an optional add-on to the system; users are free to use Cover It Live, Echo, or any other chat system they'd like instead.

Rather than mounting the app to a route, Datajam Chat behaves more like a plugin and inserts itself into the correct places, extending existing models and adding its own.

For these reasons, the test app is actually a full checkout of Datajam, included as a submodule. This is not only required to allow a checkout of datajam\_chat to run via pow, rackup or foreman, it also allows you to test against the actual system to ensure you haven't broken anything.

To get up and running, you'll need to `git submodule init && git submodule update` after cloning.

## Specs

Chat is tested with `RSpec` and `Jasmine`. You can run:

    $ rake spec

and

    $ rake jasmine

to run the respective suites.

## The Build Task

The majority of Datajam Chat is a Backbone app and therefore is written in javascript. It includes many models, views and collections, and for performance bundles all of them into one minified file for use in production environments.

In development, Datajam Chat checks a JS flag called `Datajam.DEBUG` to determine whether to use the compiled version of the code, or to pull down all of the dependencies atomically with require.js, Datajam's chosen dependency manager. This means you'll see changes as you make them to the app itself while developing, but in order for them to reflect in production, you'll have to build the app.

Because the order of its modules is important, there is a rake task designated for automating builds. After making changes and testing, run:

    $ rake chat:build

to recompile the javascript, and you'll be ready to commit. If you add files, you'll need to insert their paths in the correct place in `.javascripts-manifest` so the build task will include it. The determining factor behind include order is the flow of dependencies--any modules required by your module must be defined above it.

Do not define your uncompressed modules with names, the build script will handle this as it processes them.

**IMPORTANT:** Watch the output of the rake task, an exception will be raised if your js syntax prevents closure compiler from running properly.

_Also note that templates are not compiled and therefore template changes do not necessitate a build._

### Automatically Building the JS

You can have git build via .pre-commit.sh every time you commit, by running the following:

    $ cd .git/hooks && ln -s ../../.pre-commit.sh pre-commit
