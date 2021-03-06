import builder from '../builder';

export default builder.createObjectType('User', {
  shape: t => ({
    id: t.exposeID('id'),
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
    email: t.exposeString('email'),
  }),
  extends: {
    Query: t => ({
      user: t.field({
        type: 'User',
        args: {
          id: t.arg.id({ required: true }),
        },
        resolve: (parent, args, { User }) => {
          const user = User.map.get(parseInt(args.id, 10));

          if (!user) {
            throw new Error(`User with id ${args.id} was not found`);
          }

          return user;
        },
      }),
    }),
    Mutation: t => ({
      createUser: t.field({
        type: 'User',
        args: {
          firstName: t.arg('String', {
            required: true,
          }),
          lastName: t.arg.string({
            required: true,
          }),
        },
        resolve: (parent, { firstName, lastName }, { User }) => {
          const user = User.create(firstName, lastName, 'User');

          return user;
        },
      }),
      createAdmin: t.field({
        type: 'User',
        args: {
          firstName: t.arg('String', {
            required: true,
          }),
          lastName: t.arg.string({
            required: true,
          }),
        },
        resolve: (parent, { firstName, lastName }, { User }) => {
          const user = User.create(firstName, lastName, 'Admin');

          return user;
        },
      }),
    }),
    Subscription: t => ({
      user: t.field({
        type: 'User',
        args: {
          id: t.arg.id({ required: true }),
        },
        subscribe: async function*() {
          return {};
        },
        resolve: (parent, args, { User }) => {
          const user = User.map.get(parseInt(args.id, 10));

          if (!user) {
            throw new Error(`User with id ${args.id} was not found`);
          }

          return user;
        },
      }),
    }),
  },
});
