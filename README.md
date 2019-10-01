# Sharded Cards Functions

## License; use, modification, sharing, and distribution

This repo does **not** have an Open Source license and its copyright is only extended to the specified authors.
* You are not permitted to share the software.
* You are not permitted to distribute the software.
* You are not permitted to modify the software.
* You are not permitted to use the software, except at https://sharded.cards/.

* You are, however, permitted to view and fork this repo.

You can read more about our permissions at https://choosealicense.com/no-permission/

## Development

### Contributing

If you want to get started on contributing, head over the [Sharded Cards Wiki](https://github.com/rhyeen/shardedcards) and either check out the [Issues](https://github.com/rhyeen/shardedcards/issues) or [Projects](https://github.com/rhyeen/shardedcards/projects).  Not sure where to start?  You can [post your interest here](https://github.com/rhyeen/shardedcards/issues/2) and I'll get you started.

We keep a separate repo for Issues/Projects because the project spans more than one repo (front-end, back-end, etc).  If there is an issue specific to only this project, you can just [post an issue here](https://github.com/rhyeen/sc-app/issues).

### Setup

```
git clone https://github.com/rhyeen/sc-functions
cd sc-functions
npm install -g firebase-tools
cd functions
npm install
```

### Testing

To run the tests, you can run `npm run test`.

### Build

To build the app, run `npm run build` inside `functions`. This will create a `build` folder that has all the minified 
bundles and assets you need to deploy. If you want to test that the build output works, you can run

```
npm run serve
```

## Notes

### Deployment

For deployment, I use [Firebase Functions](https://firebase.google.com/docs/functions/). Since **Sharded Cards** does not have an Open Source license, you are not permitted to deploy the code to a public URL.
