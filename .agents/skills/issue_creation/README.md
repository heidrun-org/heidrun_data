# issue_creation

The skill `issue_creation` gives a coding agent one way to create an issue on GitHub or on GitLab, to attach screenshots and videos to the issue, and to write the text of the issue and of its comments. This way of working is Issue Creation.

## Purpose

An issue is the record of a problem or of a request. People read the issue later, often in a browser, and must see the screenshots and follow the links to the files and to the other issues. When a coding agent writes an issue without rules, the screenshots are committed to the repository or are missing, the file names are plain text, and the references to other issues show only a number.

Issue Creation makes every issue readable on GitHub and on GitLab:

- The coding agent creates the issue with the command `gh` on GitHub, or with the command `glab` on GitLab.
- The coding agent attaches each screenshot, image, or video with the flag `--attach`. The coding agent never commits an image to the repository only to show the image in an issue.
- Each file name in the text is a link to the file on GitHub or on GitLab.
- Each reference to another issue is its own bullet with the plain address of the issue, so that GitHub shows the title, the state, and the number of the issue. On GitLab, the bullet has the form `- #506+`, so that GitLab shows the title.

## When the coding agent uses the skill

- The coding agent creates an issue.
- The coding agent attaches an image or a video to an issue.
- The coding agent writes the body or a comment of an issue.

## Configuration

The skill `issue_creation` needs no configuration. The command `gh` or the command `glab` must be installed and logged in.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill issue_creation
```

## Files

- [SKILL.md](SKILL.md): the instructions for the coding agent.
