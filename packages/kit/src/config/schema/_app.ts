import { resolve, join } from 'pathe'
import { existsSync, readdirSync } from 'fs'
import defu from 'defu'
import { isRelative, joinURL, hasProtocol } from 'ufo'

export default {
  /** Vue.js config */
  vue: {
    /**
     * Properties that will be set directly on `Vue.config` for vue@2.
     *
     * @see [vue@2 Documentation](https://vuejs.org/v2/api/#Global-Config)
     * @type {import('vue/types/vue').VueConfiguration}
     * @version 2
     */
    config: {
      silent: { $resolve: (val, get) => val ?? !get('dev') },
      performance: { $resolve: (val, get) => val ?? get('dev') },
    },
    /**
     * Options for the Vue compiler that will be passed at build time
     * @see [documentation](https://v3.vuejs.org/api/application-config.html)
     * @type {import('@vue/compiler-core').CompilerOptions}
     * @version 3
     */
    compilerOptions: {}
  },

  /**
   * Nuxt App configuration.
   * @version 2
   */
  app: {
    $resolve: (val, get) => {
      const useCDN = hasProtocol(get('build.publicPath'), true) && !get('dev')
      const isRelativePublicPath = isRelative(get('build.publicPath'))
      return defu(val, {
        basePath: get('router.base'),
        assetsPath: isRelativePublicPath ? get('build.publicPath') : useCDN ? '/' : joinURL(get('router.base'), get('build.publicPath')),
        cdnURL: useCDN ? get('build.publicPath') : null
      })
    }
  },

  /**
   * The path to a templated HTML file for rendering Nuxt responses.
   * Uses `<srcDir>/app.html` if it exists or the Nuxt default template if not.
   *
   * @example
   * ```html
   * <!DOCTYPE html>
   * <html {{ HTML_ATTRS }}>
   *   <head {{ HEAD_ATTRS }}>
   *     {{ HEAD }}
   *   </head>
   *   <body {{ BODY_ATTRS }}>
   *     {{ APP }}
   *   </body>
   * </html>
   * ```
   * @version 2
   */
  appTemplatePath: {
    $resolve: (val, get) => {
      if (val) {
        return resolve(get('srcDir'), val)
      }
      if (existsSync(join(get('srcDir'), 'app.html'))) {
        return join(get('srcDir'), 'app.html')
      }
      return resolve(get('buildDir'), 'views/app.template.html')
    }
  },

  /**
   * Enable or disable vuex store.
   *
   * By default it is enabled if there is a `store/` directory
   * @version 2
   */
  store: {
    $resolve: (val, get) => val !== false &&
      existsSync(join(get('srcDir'), get('dir.store'))) &&
      readdirSync(join(get('srcDir'), get('dir.store')))
        .find(filename => filename !== 'README.md' && filename[0] !== '.')
  },

  /**
   * Options to pass directly to `vue-meta`.
   *
   * @see [documentation](https://vue-meta.nuxtjs.org/api/#plugin-options).
   * @type {import('vue-meta').VueMetaOptions}
   * @version 2
   */
  vueMeta: null,

  /**
   * Set default configuration for `<head>` on every page.
   *
   * @see [documentation](https://vue-meta.nuxtjs.org/api/#metainfo-properties) for specifics.
   * @type {import('vue-meta').MetaInfo}
   * @version 2
   */
  head: {
    /** Each item in the array maps to a newly-created `<meta>` element, where object properties map to attributes. */
    meta: [],
    /** Each item in the array maps to a newly-created `<link>` element, where object properties map to attributes. */
    link: [],
    /** Each item in the array maps to a newly-created `<style>` element, where object properties map to attributes. */
    style: [],
    /** Each item in the array maps to a newly-created `<script>` element, where object properties map to attributes. */
    script: []
  },

  /**
   * Set default configuration for `<head>` on every page.
   *
   * @example
   * ```js
   * meta: {
   *  meta: [
   *    // <meta name="viewport" content="width=device-width, initial-scale=1">
   *    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
   *  ],
   *  script: [
   *    // <script src="https://myawesome-lib.js"></script>
   *    { src: 'https://awesome-lib.js' }
   *  ],
   *  link: [
   *    // <link rel="stylesheet" href="https://myawesome-lib.css">
   *    { rel: 'stylesheet', href: 'https://awesome-lib.css' }
   *  ],
   *  // please note that this is an area that is likely to change
   *  style: [
   *    // <style type="text/css">:root { color: red }</style>
   *    { children: ':root { color: red }', type: 'text/css' }
   *  ]
   * }
   * ```
   * @type {import('nuxt3/dist/meta/runtime/types').MetaObject}
   * @version 3
   */
  meta: {
    meta: [],
    link: [],
    style: [],
    script: []
  },

  /**
   * Configuration for the Nuxt `fetch()` hook.
   * @version 2
   */
  fetch: {
    /** Whether to enable `fetch()` on the server. */
    server: true,
    /** Whether to enable `fetch()` on the client. */
    client: true
  },

  /**
   * An array of nuxt app plugins.
   *
   * Each plugin can be a string (which can be an absolute or relative path to a file).
   * If it ends with `.client` or `.server` then it will be automatically loaded only
   * in the appropriate context.
   *
   * It can also be an object with `src` and `mode` keys.
   *
   * @example
   * ```js
   * plugins: [
   *   '~/plugins/foo.client.js', // only in client side
   *   '~/plugins/bar.server.js', // only in server side
   *   '~/plugins/baz.js', // both client & server
   *   { src: '~/plugins/both-sides.js' },
   *   { src: '~/plugins/client-only.js', mode: 'client' }, // only on client side
   *   { src: '~/plugins/server-only.js', mode: 'server' } // only on server side
   * ]
   * ```
   * @type {typeof import('../src/types/nuxt').NuxtPlugin[]}
   * @version 2
   */
  plugins: [],

  /**
   * You may want to extend plugins or change their order. For this, you can pass
   * a function using `extendPlugins`. It accepts an array of plugin objects and
   * should return an array of plugin objects.
   * @type {(plugins: Array<{ src: string, mode?: 'client' | 'server' }>) => Array<{ src: string, mode?: 'client' | 'server' }>}
   * @version 2
   */
  extendPlugins: null,

  /**
   * You can define the CSS files/modules/libraries you want to set globally
   * (included in every page).
   *
   * Nuxt will automatically guess the file type by its extension and use the
   * appropriate pre-processor. You will still need to install the required
   * loader if you need to use them.
   *
   * @example
   * ```js
   * css: [
   *   // Load a Node.js module directly (here it's a Sass file)
   *   'bulma',
   *   // CSS file in the project
   *   '@/assets/css/main.css',
   *   // SCSS file in the project
   *   '@/assets/css/main.scss'
   * ]
   * ```
   * @type {string[]}
   * @version 2
   * @version 3
   */
  css: [],

  /**
   * An object where each key name maps to a path to a layout .vue file.
   *
   * Normally there is no need to configure this directly.
   * @type {Record<string, string>}
   * @version 2
   */
  layouts: {},

  /**
   * Set a custom error page layout.
   *
   * Normally there is no need to configure this directly.
   * @type {string}
   * @version 2
   */
  ErrorPage: null,

  /**
   * Configure the Nuxt loading progress bar component that's shown between
   * routes. Set to `false` to disable. You can also customize it or create
   * your own component.
   * @version 2
   */
  loading: {
    /** CSS color of the progress bar */
    color: 'black',
    /**
     * CSS color of the progress bar when an error appended while rendering
     * the route (if data or fetch sent back an error for example).
     */
    failedColor: 'red',
    /** Height of the progress bar (used in the style property of the progress bar). */
    height: '2px',
    /**
     * In ms, wait for the specified time before displaying the progress bar.
     * Useful for preventing the bar from flashing.
     */
    throttle: 200,
    /**
     * In ms, the maximum duration of the progress bar, Nuxt assumes that the
     * route will be rendered before 5 seconds.
     */
    duration: 5000,
    /** Keep animating progress bar when loading takes longer than duration. */
    continuous: false,
    /** Set the direction of the progress bar from right to left. */
    rtl: false,
    /** Set to false to remove default progress bar styles (and add your own). */
    css: true
  },

  /**
   * Show a loading spinner while the page is loading (only when `ssr: false`).
   *
   * Set to `false` to disable. Alternatively, you can pass a string name or an object for more
   * configuration. The name can refer to an indicator from [SpinKit](https://tobiasahlin.com/spinkit/)
   * or a path to an HTML template of the indicator source code (in this case, all the
   * other options will be passed to the template.)
   * @version 2
   */
  loadingIndicator: {
    $resolve: (val, get) => {
      val = typeof val === 'string' ? { name: val } : val
      return defu(val, {
        name: 'default',
        color: get('loading.color') || '#D3D3D3',
        color2: '#F5F5F5',
        background: (get('manifest') && get('manifest.theme_color')) || 'white',
        dev: get('dev'),
        loading: get('messages.loading')
      })
    }
  },

  /**
   * Used to set the default properties of the page transitions.
   *
   * You can either pass a string (the transition name) or an object with properties to bind
   * to the `<Transition>` component that will wrap your pages.
   *
   * @see [vue@2 documentation](https://vuejs.org/v2/guide/transitions.html)
   * @see [vue@3 documentation](https://v3.vuejs.org/guide/transitions-enterleave.html)
   * @version 2
   */
   pageTransition: {
    $resolve: (val, get) => {
      val = typeof val === 'string' ? { name: val } : val
      return defu(val, {
        name: 'page',
        mode: 'out-in',
        appear: get('render.ssr') === false || Boolean(val),
        appearClass: 'appear',
        appearActiveClass: 'appear-active',
        appearToClass: 'appear-to'
      })
    }
  },

  /**
   * Used to set the default properties of the layout transitions.
   *
   * You can either pass a string (the transition name) or an object with properties to bind
   * to the `<Transition>` component that will wrap your layouts.
   *
   * @see [vue@2 documentation](https://vuejs.org/v2/guide/transitions.html)
   * @see [vue@3 documentation](https://v3.vuejs.org/guide/transitions-enterleave.html)
   * @version 2
   */
  layoutTransition: {
    $resolve: val => {
      val = typeof val === 'string' ? { name: val } : val
      return defu(val, {
        name: 'layout',
        mode: 'out-in'
      })
    }
  },

  /**
   * You can disable specific Nuxt features that you do not want.
   * @version 2
   */
  features: {
    /** Set to false to disable Nuxt vuex integration */
    store: true,
    /** Set to false to disable layouts */
    layouts: true,
    /** Set to false to disable Nuxt integration with `vue-meta` and the `head` property */
    meta: true,
    /** Set to false to disable middleware */
    middleware: true,
    /** Set to false to disable transitions */
    transitions: true,
    /** Set to false to disable support for deprecated features and aliases */
    deprecations: true,
    /** Set to false to disable the Nuxt `validate()` hook */
    validate: true,
    /** Set to false to disable the Nuxt `asyncData()` hook */
    useAsyncData: true,
    /** Set to false to disable the Nuxt `fetch()` hook */
    fetch: true,
    /** Set to false to disable `$nuxt.isOnline` */
    clientOnline: true,
    /** Set to false to disable prefetching behavior in `<NuxtLink>` */
    clientPrefetch: true,
    /** Set to false to disable extra component aliases like `<NLink>` and `<NChild>` */
    componentAliases: true,
    /** Set to false to disable the `<ClientOnly>` component (see [docs](https://github.com/egoist/vue-client-only)) */
    componentClientOnly: true
  }
}
