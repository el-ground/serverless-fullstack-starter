const getInjectSafeAreaInsetsString = () => {
  return `
      if (typeof Android !== 'undefined') {
        console.log('android bridge found');
        if (typeof Android.getSafeAreaInsets !== 'undefined') {
          console.log('Android.getSafeAreaInsets found');
          const safeAreaInsetsString = Android.getSafeAreaInsets();
          try {
            const safeAreaInsets = JSON.parse(safeAreaInsetsString);
            document.documentElement.style.setProperty('--safe-area-inset-top', safeAreaInsets.top + 'px');
            document.documentElement.style.setProperty('--safe-area-inset-right', safeAreaInsets.right + 'px');
            document.documentElement.style.setProperty('--safe-area-inset-bottom', safeAreaInsets.bottom + 'px');
            document.documentElement.style.setProperty('--safe-area-inset-left', safeAreaInsets.left + 'px');
            console.log('Android.getSafeAreaInsets finished!');
          } catch (e) {
            console.error(e);
          }
        }
      }
    `
}

// this should be in the head
export const InjectSafeAreaInset = () => {
  return (
    <script
      key="safe-area-inset-setup"
      /* eslint-disable-next-line react/no-danger */
      dangerouslySetInnerHTML={{
        __html: getInjectSafeAreaInsetsString(),
      }}
    />
  )
}
