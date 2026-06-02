Custom Property Map
===================

Allows you to update custom properties on all repositories across an entire GitHub organisation.


Usage
-----

### GitHub token

You will need to create a GitHub token and have it in the environment as `GITHUB_TOKEN` when you run the script.

You should create the token against the organisation you wish to update the custom properties of, and only give it
Read & Write access to Repository Custom Properties.

**Recommendation:** Tokens should never last longer than you need them. Ideally, set it to only last one day.

Visit [https://github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens) to create
the token.

### Get existing custom property values

Use `npm start get -o <ORG> [property]` where `<ORG>` is the name of your organisation, and `[property]` is
the name of the property you want to get the values of.

This will print the CSV to the console so if you want to write it to a file you can use `--output <FILE>` where file
is the file in which to store the CSV.

### Update custom property values

The CSV containing existing values has 3 columns

- `repository` is the name of each repository in the organisation
- a column named for whatever the `[property]` queried is, that contains the current value of that property
- a column called `newValue` that should be empty

In the CSV, enter the newValue into only the rows you wish to change. If a repository is not having its custom property
updated, you can ignore it.

It's worth leaving repositories not being changed in the CSV with an empty `newValue` and storing the file somewhere
(for example in another git repository) to represent the changes made, or not made in the case of empty values.

Run `npm start update -o <ORG> [filename]` where `[filename]` is the path to the CSV you just edited.

This will then update each repository in turn, but will error if any of the values have changed since the `csv` was
created, possibly indicating an unexpect or unwanted change.

### Undoing a previous change

If you want to fully undo the changes you made with `update` without "fixing forward", use `npm start update [filename]`
which works identically to `update` but internally reverses the changes, so it will look for `newValue` and change it
back to whatever the old value was in the CSV.


Example
-------

Imagine you have a large organisation with many repositories owned by different teams.

Each repository might have a custom property such as `owning-team` with values like `Snap`, `Crackle` and `Pop`.

Due to an organisational shake up, the projects are moving to the teams `Blossom`, `Bubbles` and `Buttercup`, but maybe
not in a one to one manner.

First we get the existing details

```bash
npm start get -o example-org owning-team --output 2026-05-25-owning-teams.csv
```

The csv we get should look something like

| repository    | owning-team | newValue |
|---------------|-------------|----------|
| auth-be       | snap        |          |
| auth-fe       | crackle     |          |
| auth-infra    | pop         |          |
| account-be    | snap        |          |
| account-fe    | crackle     |          |
| account-infra | pop         |          |
| content-be    | snap        |          |
| content-fe    | crackle     |          |
| content-infra | pop         |          |
| dev-tools     | pow         |          |

We can then enter the new values. In this case, where we used to have teams split along different disciplines, we're now
going to make multi, disciplined teams that own whole products. We'll enter the which teams are being updated into the
`newValue` column

| repository    | owning-team | newValue  |
|---------------|-------------|-----------|
| auth-be       | snap        | blossom   |
| auth-fe       | crackle     | blossom   |
| auth-infra    | pop         | blossom   |
| account-be    | snap        | bubbles   |
| account-fe    | crackle     | bubbles   |
| account-infra | pop         | bubbles   |
| content-be    | snap        | buttercup |
| content-fe    | crackle     | buttercup |
| content-infra | pop         | buttercup |
| dev-tools     | pow         |           |

However, the dev-tools team is not changing so we keep that blank, and it won't change.

We'll save the changes to another git repository to keep track of what changed and when.

Next we run the updater:

```bash
npm start update -o example-org 2026-05-25-owning-teams.csv
```

Note we don't need to specify the property as it's the middle common name, and before changing any value the updater
will check the current value is still the expected value.

If we decide this was all a terrible mistake, we can all the changes with the undo command.

```bash
npm start undo -o example-org 2026-05-25-owning-teams.csv
```

Again, it will check that the property is currently set to whatever its `newValue` is, before changing it back to the
previous value.
