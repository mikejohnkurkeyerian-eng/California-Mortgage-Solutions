const fs = require('fs');
const path = require('path');

const patchFile = path.join(__dirname, '..', 'patches', 'react-native-gesture-handler+2.29.1.patch');

if (!fs.existsSync(patchFile)) {
  console.log('Patch file not found, skipping...');
  process.exit(0);
}

console.log('Applying patch for react-native-gesture-handler...');

// Apply patch manually by reading and modifying the files
const buttonInterfacePath = path.join(__dirname, '..', 'node_modules', 'react-native-gesture-handler', 'android', 'paper', 'src', 'main', 'java', 'com', 'facebook', 'react', 'viewmanagers', 'RNGestureHandlerButtonManagerInterface.java');
const rootInterfacePath = path.join(__dirname, '..', 'node_modules', 'react-native-gesture-handler', 'android', 'paper', 'src', 'main', 'java', 'com', 'facebook', 'react', 'viewmanagers', 'RNGestureHandlerRootViewManagerInterface.java');

if (fs.existsSync(buttonInterfacePath)) {
  let content = fs.readFileSync(buttonInterfacePath, 'utf8');
  if (!content.includes('ViewManagerWithGeneratedInterface removed in React Native 0.74+')) {
    content = content.replace(
      /import com\.facebook\.react\.uimanager\.ViewManagerWithGeneratedInterface;/g,
      '// ViewManagerWithGeneratedInterface removed in React Native 0.74+ - compatibility patch\n// import com.facebook.react.uimanager.ViewManagerWithGeneratedInterface;'
    );
    content = content.replace(
      /public interface RNGestureHandlerButtonManagerInterface<T extends View> extends ViewManagerWithGeneratedInterface/g,
      'public interface RNGestureHandlerButtonManagerInterface<T extends View>'
    );
    fs.writeFileSync(buttonInterfacePath, content, 'utf8');
    console.log('✓ Applied patch to RNGestureHandlerButtonManagerInterface.java');
  } else {
    console.log('✓ RNGestureHandlerButtonManagerInterface.java already patched');
  }
}

if (fs.existsSync(rootInterfacePath)) {
  let content = fs.readFileSync(rootInterfacePath, 'utf8');
  if (!content.includes('ViewManagerWithGeneratedInterface removed in React Native 0.74+')) {
    content = content.replace(
      /import com\.facebook\.react\.uimanager\.ViewManagerWithGeneratedInterface;/g,
      '// ViewManagerWithGeneratedInterface removed in React Native 0.74+ - compatibility patch\n// import com.facebook.react.uimanager.ViewManagerWithGeneratedInterface;'
    );
    content = content.replace(
      /public interface RNGestureHandlerRootViewManagerInterface<T extends View> extends ViewManagerWithGeneratedInterface/g,
      'public interface RNGestureHandlerRootViewManagerInterface<T extends View>'
    );
    fs.writeFileSync(rootInterfacePath, content, 'utf8');
    console.log('✓ Applied patch to RNGestureHandlerRootViewManagerInterface.java');
  } else {
    console.log('✓ RNGestureHandlerRootViewManagerInterface.java already patched');
  }
}

// Also patch the gradle-plugin to skip Kotlin metadata version check
const gradlePluginBuildPath = path.join(__dirname, '..', 'node_modules', '@react-native', 'gradle-plugin', 'build.gradle.kts');
if (fs.existsSync(gradlePluginBuildPath)) {
  let content = fs.readFileSync(gradlePluginBuildPath, 'utf8');
  if (!content.includes('-Xskip-metadata-version-check')) {
    // Add the flag to the KotlinCompile task configuration
    content = content.replace(
      /(tasks\.withType<KotlinCompile> \{[^}]*kotlinOptions \{[^}]*)(\})/s,
      (match, p1, p2) => {
        if (!p1.includes('-Xskip-metadata-version-check')) {
          return p1 + '    // Skip metadata version check to fix compatibility with Gradle 8.7\'s Kotlin 1.9.22\n    freeCompilerArgs += listOf("-Xskip-metadata-version-check")\n  ' + p2;
        }
        return match;
      }
    );
    fs.writeFileSync(gradlePluginBuildPath, content, 'utf8');
    console.log('✓ Applied patch to @react-native/gradle-plugin/build.gradle.kts');
  } else {
    console.log('✓ @react-native/gradle-plugin/build.gradle.kts already patched');
  }
}

console.log('Patch applied successfully!');

