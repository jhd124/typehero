# Read current version from VERSION file, defaulting to 0.0.0 for first publish.
VERSION := $(shell test -f VERSION && cat VERSION || echo 0.0.0)

# Publish a new version: bump version, commit, push, tag, push tag
publish:
	@echo "Current version: $(VERSION)"
	@# Parse and increment patch version
	@if ! echo "$(VERSION)" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$$'; then \
		echo "Invalid VERSION: $(VERSION). Expected x.y.z."; \
		exit 1; \
	fi; \
	MAJOR=$$(echo $(VERSION) | cut -d. -f1); \
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
