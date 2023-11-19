export const getInjectSafeAreaInsetString = () => {
  return `
      if (typeof Android !== 'undefined') {
        console.log('android bridge found');
        if (typeof Android.getSafeAreaInsets !== 'undefined') {
          console.log('Android.getSafeAreaInsets found');
          const safeAreaInsetsString = Android.getSafeAreaInsets();
          try {
            const safeAreaInsets = JSON.parse(safeAreaInsetsString);
            const styles = \`
              :root {
                --safe-area-inset-top: \${safeAreaInsets.top}px;
                --safe-area-inset-right: \${safeAreaInsets.right}px;
                --safe-area-inset-bottom: \${safeAreaInsets.bottom}px;
                --safe-area-inset-left: \${safeAreaInsets.left}px;
              }
            \`
            
            var styleSheet = document.createElement("style")
            styleSheet.innerText = styles
            document.head.appendChild(styleSheet)
           
            console.log('Android.getSafeAreaInsets finished!');
          } catch (e) {
            console.error(e);
          }
        }
      }
    `
  /*
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
    */
}
