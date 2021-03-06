/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { GraphQLFieldConfig, GraphQLFieldConfigArgumentMap } from 'graphql';
// @ts-ignore
import fromEntries from 'object.fromentries';
import {
  TypeParam,
  InputFields,
  ShapeFromTypeParam,
  FieldNullability,
  FieldOptionsFromKind,
} from '../types';
import { typeFromParam, buildArg } from '../utils';
import BaseType from './base';
import BasePlugin from '../plugin';
import { BuildCache } from '..';

export default class Field<
  Args extends InputFields<Types>,
  Types extends GiraphQLSchemaTypes.TypeInfo,
  ParentShape,
  Type extends TypeParam<Types>,
  Nullable extends FieldNullability<Types, Type> = FieldNullability<Types, Type>,
  Kind extends 'Object' | 'Interface' | 'Root' | 'Subscription' =
    | 'Object'
    | 'Interface'
    | 'Root'
    | 'Subscription'
> {
  shape?: ShapeFromTypeParam<Types, Type, true>;

  nullable: Nullable;

  args: Args = {} as Args;

  type: Type;

  options: FieldOptionsFromKind<Types, TypeParam<Types>, TypeParam<Types>, boolean, {}, Kind>;

  parentTypename: string;

  constructor(
    options: FieldOptionsFromKind<Types, ParentShape, Type, Nullable, Args, Kind>,
    parentTypename: string,
  ) {
    this.options = (options as unknown) as FieldOptionsFromKind<
      Types,
      TypeParam<Types>,
      TypeParam<Types>,
      boolean,
      {},
      Kind
    >;
    this.nullable = options.nullable || (false as Nullable);
    this.args = options.args ? options.args! : ({} as Args);
    this.type = options.type;
    this.parentTypename = parentTypename;
  }

  protected buildArgs(cache: BuildCache<Types>): GraphQLFieldConfigArgumentMap {
    return fromEntries(
      Object.keys(this.args).map(key => {
        const arg = this.args[key];

        return [
          key,
          {
            description:
              typeof arg !== 'object' || arg instanceof BaseType || Array.isArray(arg)
                ? undefined
                : arg.description,
            required:
              typeof arg !== 'object' || arg instanceof BaseType || Array.isArray(arg)
                ? false
                : arg.required ?? false,
            type: buildArg(arg, cache),
            defaultValue:
              typeof arg !== 'object' || arg instanceof BaseType || Array.isArray(arg)
                ? undefined
                : arg.default,
          },
        ];
      }),
    );
  }

  build(
    name: string,
    cache: BuildCache<Types>,
    plugins: BasePlugin<Types>[],
  ): GraphQLFieldConfig<unknown, unknown> {
    const baseConfig: GraphQLFieldConfig<unknown, unknown> = {
      args: this.buildArgs(cache),
      description: this.options.description,
      resolve:
        cache.resolverMock(this.parentTypename, name) ??
        (this.options as { resolve?: (...args: unknown[]) => unknown }).resolve ??
        (() => {
          throw new Error(`Not implemented: No resolver found for ${this.parentTypename}.${name}`);
        }),
      subscribe:
        cache.subscribeMock(this.parentTypename, name) ??
        (this.options as { subscribe?: (...args: unknown[]) => unknown }).subscribe,
      type: typeFromParam(this.type, cache, this.nullable),
      extensions: this.options.extensions,
    };

    return plugins.reduce((config, plugin) => {
      return plugin.updateFieldConfig
        ? plugin.updateFieldConfig(name, this as any, config, cache) // eslint-disable-line @typescript-eslint/no-explicit-any
        : config;
    }, baseConfig);
  }
}
