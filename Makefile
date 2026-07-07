# Read current version from VERSION file
VERSION := $(shell cat VERSION)

# Publish a new version: bump version, commit, push, tag, push tag
publish:
	@echo "Current version: $(VERSION)"
	@# Parse and increment patch version
	@MAJOR=$$(echo $(VERSION) | cut -d. -f1); \
	MINOR=$$(echo $(VERSION) | cut -d. -f2); \
	PATCH=$$(echo $(VERSION) | cut -d. -f3); \
	NEW_PATCH=$$((PATCH + 1)); \
	NEW_VERSION="$$MAJOR.$$MINOR.$$NEW_PATCH"; \
	echo "New version: $$NEW_VERSION"; \
	echo "$$NEW_VERSION" > VERSION; \
	git add VERSION; \
	git commit -m "chore: bump version to $$NEW_VERSION"; \
	git push; \
	git tag "v$$NEW_VERSION"; \
	git push origin "v$$NEW_VERSION"; \
	echo "Published version v$$NEW_VERSION"
