export const match =
  (name: string, pattern?: any) =>
  (text: string, ctx: any): RegExpExecArray | null =>
    text === (ctx.t && ctx.t(name, pattern)) ? /.*/.exec(text) : null;
