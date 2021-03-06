/* eslint-disable no-restricted-syntax */
import { MergeTypeMap, DefaultTypeMap } from './types';
import ObjectType from './graphql/object';
import UnionType from './graphql/union';
import InputObjectType from './graphql/input';
import InterfaceType from './graphql/interface';
import EnumType from './graphql/enum';
import ScalarType from './graphql/scalar';
import InputFieldBuilder from './fieldUtils/input';
import BasePlugin from './plugin';
import Field from './graphql/field';
import BuildCache from './build-cache';
import FieldBuilder from './fieldUtils/builder';
import RootFieldBuilder from './fieldUtils/root';
import RootType from './graphql/root';
import FieldSet from './graphql/field-set';
import RootFieldSet from './graphql/root-field-set';
import SchemaBuilder from './builder';

export * from './types';

export {
  BasePlugin,
  BuildCache,
  EnumType,
  Field,
  FieldBuilder,
  FieldSet,
  InputFieldBuilder,
  InputObjectType,
  InterfaceType,
  ObjectType,
  RootType,
  RootFieldBuilder,
  RootFieldSet,
  ScalarType,
  UnionType,
};

export default SchemaBuilder as {
  new <
    PartialTypes extends GiraphQLSchemaTypes.PartialTypeInfo = {},
    Types extends MergeTypeMap<DefaultTypeMap, PartialTypes> = MergeTypeMap<
      DefaultTypeMap,
      PartialTypes
    >
  >(options?: {
    plugins?: BasePlugin<Types>[];
    stateful?: boolean;
  }): GiraphQLSchemaTypes.SchemaBuilder<Types>;
};
