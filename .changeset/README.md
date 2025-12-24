# Changesets

This directory contains changesets for the monorepo.

## What are changesets?

Changesets are a way to manage versions and changelogs with a focus on monorepos. They provide a way to version packages together or separately as needed.

## How to use

1. Make your changes to the codebase
2. Run `pnpm changeset` to create a new changeset
3. Follow the prompts to describe your changes
4. Commit the changeset file along with your changes

The CI/CD pipeline will automatically create a release PR when changesets are detected.
