window.bookRepository = {
  async getBooks() {
    return window.BOOKS.map((b) => ({
      ...b,
      themes: { ...b.themes },
      interests: [...b.interests],
    }));
  },
};
