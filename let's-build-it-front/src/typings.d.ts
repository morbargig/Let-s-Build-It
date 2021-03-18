/*
 * Extra typings definitions
 */

// Allow .json files imports
declare module '*.json';

// SystemJS module definition
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// You should specify the CKEditor 5 build you use here
// We used Classic build for our demos
declare module '@ckeditor/ckeditor5-build-classic' {
  const ClassicEditorBuild: any;

  export = ClassicEditorBuild;
}

// highlight.js languages to load
declare module 'highlight.js/lib/languages/typescript' {
  const HighlightJs: any;

  export = HighlightJs;
}

declare module 'highlight.js/lib/languages/htmlbars' {
  const HighlightJs: any;

  export = HighlightJs;
}

declare module 'highlight.js/lib/languages/json' {
  const HighlightJs: any;

  export = HighlightJs;
}



