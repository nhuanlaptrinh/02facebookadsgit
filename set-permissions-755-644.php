<?php
/**
 * Script để set quyền 755 cho folders và 644 cho files
 * ✅ AN TOÀN: Đây là quyền được khuyến nghị cho production
 * 
 * Cách sử dụng:
 * 1. Upload file này lên thư mục public_html của website
 * 2. Truy cập: http://your-domain.com/set-permissions-755-644.php?p=YOUR_PASSWORD
 * 3. XÓA FILE NÀY NGAY sau khi chạy xong!
 */

// Bảo vệ: Chỉ cho phép chạy với password
$password = 'CHANGE_THIS_PASSWORD_123'; // ĐỔI PASSWORD NÀY!
$inputPassword = isset($_GET['p']) ? $_GET['p'] : '';

if ($inputPassword !== $password) {
    die('Unauthorized! Please provide correct password in URL: ?p=YOUR_PASSWORD');
}

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Set Permissions 755/644</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .success { color: green; padding: 10px; background: #d4edda; border-radius: 4px; margin: 10px 0; }
        .error { color: red; padding: 10px; background: #f8d7da; border-radius: 4px; margin: 10px 0; }
        .info { color: #0c5460; padding: 10px; background: #d1ecf1; border-radius: 4px; margin: 10px 0; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; }
        button { background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background: #218838; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat-box { flex: 1; padding: 15px; background: #f8f9fa; border-radius: 4px; text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #28a745; }
    </style>
</head>
<body>
    <div class="container">
        <h1>✅ Set Permissions: 755 (Folders) / 644 (Files)</h1>
        
        <?php
        $baseDir = __DIR__;
        $folders = [];
        $files = [];
        $errors = [];
        
        function setPermissionsRecursive($dir, $depth = 0) {
            global $folders, $files, $errors;
            
            if ($depth > 20) return; // Giới hạn độ sâu
            
            if (!is_dir($dir)) {
                $errors[] = "Not a directory: $dir";
                return;
            }
            
            // Set quyền 755 cho folder hiện tại (trừ file script này)
            if ($dir != __DIR__ || basename($dir) != basename(__FILE__, '.php')) {
                if (chmod($dir, 0755)) {
                    $folders[] = $dir;
                } else {
                    $errors[] = "Failed folder: $dir";
                }
            }
            
            // Đọc các file và folder
            $items = scandir($dir);
            foreach ($items as $item) {
                if ($item == '.' || $item == '..' || 
                    $item == 'set-permissions.php' || 
                    $item == 'set-permissions-755-644.php' ||
                    $item == 'set-permissions-777.php') {
                    continue; // Bỏ qua các file script
                }
                
                $path = $dir . '/' . $item;
                
                if (is_dir($path)) {
                    // Đệ quy cho folder
                    setPermissionsRecursive($path, $depth + 1);
                } else {
                    // Set quyền 644 cho file
                    if (chmod($path, 0644)) {
                        $files[] = $path;
                    } else {
                        $errors[] = "Failed file: $path";
                    }
                }
            }
        }
        
        if (isset($_POST['execute'])) {
            echo '<div class="info"><strong>ℹ️ Đang set quyền...</strong></div>';
            
            // Set quyền cho thư mục gốc trước
            chmod($baseDir, 0755);
            $folders[] = $baseDir;
            
            // Set quyền đệ quy
            setPermissionsRecursive($baseDir);
            
            echo '<div class="success"><strong>✅ HOÀN TẤT!</strong></div>';
            
            // Thống kê
            $totalFolders = count($folders);
            $totalFiles = count($files);
            $totalErrors = count($errors);
            
            echo '<div class="stats">';
            echo '<div class="stat-box"><div class="stat-number">' . $totalFolders . '</div><div>Folders (755)</div></div>';
            echo '<div class="stat-box"><div class="stat-number">' . $totalFiles . '</div><div>Files (644)</div></div>';
            if ($totalErrors > 0) {
                echo '<div class="stat-box" style="background: #f8d7da;"><div class="stat-number" style="color: #dc3545;">' . $totalErrors . '</div><div>Errors</div></div>';
            }
            echo '</div>';
            
            if ($totalErrors > 0) {
                echo '<div class="error"><strong>Lỗi:</strong> ' . $totalErrors . ' file/folder không thể set quyền</div>';
                echo '<h3>Chi tiết lỗi:</h3>';
                echo '<pre>' . implode("\n", array_slice($errors, 0, 20)) . '</pre>';
            }
            
            echo '<h3>Một số file/folder đã được set quyền:</h3>';
            echo '<pre>';
            echo "Folders (755):\n";
            foreach (array_slice($folders, 0, 10) as $folder) {
                echo "✓ $folder\n";
            }
            if ($totalFolders > 10) echo "... và " . ($totalFolders - 10) . " folders khác\n";
            echo "\nFiles (644):\n";
            foreach (array_slice($files, 0, 10) as $file) {
                echo "✓ $file\n";
            }
            if ($totalFiles > 10) echo "... và " . ($totalFiles - 10) . " files khác\n";
            echo '</pre>';
            
            echo '<div class="info"><strong>✅ Đã set quyền thành công!</strong><br>';
            echo 'Quyền này an toàn và được khuyến nghị cho production.</div>';
            
            echo '<div class="error"><strong>⚠️ QUAN TRỌNG:</strong> Hãy XÓA file set-permissions-755-644.php này ngay để bảo mật!</div>';
            
        } else {
            ?>
            <div class="info">
                <strong>ℹ️ Thông tin:</strong><br>
                - Script này sẽ set quyền <strong>755</strong> cho tất cả folders (rwxr-xr-x)<br>
                - Script này sẽ set quyền <strong>644</strong> cho tất cả files (rw-r--r--)<br>
                - Đây là quyền <strong>AN TOÀN</strong> và được khuyến nghị cho production<br>
                - Quyền 755: Owner có quyền đầy đủ, Group và Others chỉ đọc/chạy<br>
                - Quyền 644: Owner đọc/ghi, Group và Others chỉ đọc
            </div>
            
            <p><strong>Thư mục sẽ được set quyền:</strong></p>
            <pre><?php echo $baseDir; ?></pre>
            
            <form method="POST">
                <button type="submit" name="execute" onclick="return confirm('Bạn có chắc chắn muốn set quyền 755 cho folders và 644 cho files?');">
                    ✅ Set Quyền 755/644 (An Toàn)
                </button>
            </form>
            
            <hr>
            <p><small>💡 Tip: Nếu không chạy được qua script, bạn có thể SSH vào server và chạy:</small></p>
            <pre>
# Set 755 cho folders
find <?php echo $baseDir; ?> -type d -exec chmod 755 {} \;

# Set 644 cho files  
find <?php echo $baseDir; ?> -type f -exec chmod 644 {} \;
            </pre>
            <?php
        }
        ?>
    </div>
</body>
</html>

